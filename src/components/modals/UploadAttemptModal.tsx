import { useEffect, useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, AlertCircle, Square, Smartphone, SwitchCamera } from "lucide-react";
import { Reel } from "@/lib/reels";
import { toast } from "sonner";
import { detectMobile } from "@/lib/recorder/isMobile";
import { fetchReelSkeleton } from "@/lib/recorder/skeletonFetch";
import {
  evaluateFraming,
  FramingStatus,
  MODEL_URL,
  WASM_BASE_URL,
  BACKEND_BASE,
  SkeletonData,
  PoseLandmark,
} from "@/lib/recorder/poseConstants";
import SkeletonGhostOverlay from "@/components/recorder/SkeletonGhostOverlay";
import type {
  PoseLandmarker as PoseLandmarkerType,
  FilesetResolver as FilesetResolverType,
} from "@mediapipe/tasks-vision";

interface UploadAttemptModalProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel | null;
  athleteId: string;
  onResult?: (reelId: string, score: number) => void;
}

type ModalState =
  | { kind: "setup" }
  | { kind: "permission-denied" }
  | { kind: "model-error" }
  | { kind: "pre-recording" }
  | { kind: "countdown"; value: 3 | 2 | 1 }
  | { kind: "recording"; startedAt: number }
  | { kind: "uploading" }
  | { kind: "done" };

const RECORD_MAX_MS = 15_000;
const MIN_STOP_MS = 2_000;
const AUTO_HOLD_MS = 3_000;
const AUTO_HOLD_TICK_MS = 100;

const UploadAttemptModal = ({
  isOpen,
  onClose,
  reel,
  athleteId,
  onResult,
}: UploadAttemptModalProps) => {
  const isMobile = useState(() => detectMobile())[0];
  const [state, setState] = useState<ModalState>({ kind: "setup" });
  const [framing, setFraming] = useState<FramingStatus>({ kind: "pending" });
  const [skeleton, setSkeleton] = useState<SkeletonData | null>(null);
  const [recordSecondsLeft, setRecordSecondsLeft] = useState(15);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [autoHoldMs, setAutoHoldMs] = useState(0); // 0..AUTO_HOLD_MS while holding green

  // Refs for resources that must not trigger re-renders
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<PoseLandmarkerType | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFramingTickRef = useRef<number>(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);
  const recordTickerRef = useRef<number | null>(null);
  const countdownTimerRef = useRef<number | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);
  const skeletonAbortRef = useRef<AbortController | null>(null);
  const framingRef = useRef<FramingStatus>({ kind: "pending" });

  const autoHoldRafRef = useRef<number | null>(null);
  const autoHoldStartRef = useRef<number | null>(null);

  // Mirror framing into a ref so countdown loop can see live updates
  useEffect(() => {
    framingRef.current = framing;
  }, [framing]);

  /** Hard cleanup of every external resource. Called on close, unmount, errors. */
  const cleanupAll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (recordTimerRef.current !== null) {
      clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (recordTickerRef.current !== null) {
      clearInterval(recordTickerRef.current);
      recordTickerRef.current = null;
    }
    if (countdownTimerRef.current !== null) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (autoHoldRafRef.current !== null) {
      cancelAnimationFrame(autoHoldRafRef.current);
      autoHoldRafRef.current = null;
    }
    autoHoldStartRef.current = null;
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      try {
        recorderRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    recorderRef.current = null;
    recordChunksRef.current = [];
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (landmarkerRef.current) {
      try {
        landmarkerRef.current.close();
      } catch {
        /* ignore */
      }
      landmarkerRef.current = null;
    }
    if (uploadAbortRef.current) {
      uploadAbortRef.current.abort();
      uploadAbortRef.current = null;
    }
    if (skeletonAbortRef.current) {
      skeletonAbortRef.current.abort();
      skeletonAbortRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    cleanupAll();
    setState({ kind: "setup" });
    setFraming({ kind: "pending" });
    setSkeleton(null);
    setRecordSecondsLeft(15);
    onClose();
  }, [cleanupAll, onClose]);

  // ---- Setup: camera + MediaPipe + skeleton fetch (parallel) ----
  const setupResources = useCallback(async () => {
    if (!reel) return;
    setState({ kind: "setup" });

    // 1. Camera (must succeed to proceed)
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
    } catch (err) {
      console.error("Camera permission denied:", err);
      setState({ kind: "permission-denied" });
      return;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play().catch(() => {});
    }

    // 2. Skeleton fetch (parallel, non-blocking)
    skeletonAbortRef.current = new AbortController();
    fetchReelSkeleton(reel.id, skeletonAbortRef.current.signal).then((data) => {
      if (data) setSkeleton(data);
    });

    // 3. MediaPipe model (must succeed to proceed)
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const FilesetResolver: typeof FilesetResolverType = vision.FilesetResolver;
      const PoseLandmarker: typeof PoseLandmarkerType = vision.PoseLandmarker;
      const fileset = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      const landmarker = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      landmarkerRef.current = landmarker;
    } catch (err) {
      console.error("MediaPipe load failed:", err);
      setState({ kind: "model-error" });
      return;
    }

    setState({ kind: "pre-recording" });
    startPoseLoop();
  }, [reel, facingMode]);

  /** Swap camera (rear <-> front) without disrupting modal state. Stops old stream first. */
  const switchCamera = useCallback(async () => {
    // Only allowed in pre-recording (no swap mid-record / mid-countdown / mid-upload)
    if (state.kind !== "pre-recording" || isSwitchingCamera) return;
    const next = facingMode === "environment" ? "user" : "environment";
    setIsSwitchingCamera(true);

    // Stop current pose loop + stream cleanly (keep landmarker alive — reuse it)
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: next, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setFacingMode(next);
      setFraming({ kind: "pending" });
      startPoseLoop();
    } catch (err) {
      console.error("Camera switch failed:", err);
      toast.error("Couldn't switch camera. Try again.");
      // Try to restore previous facing
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        startPoseLoop();
      } catch {
        setState({ kind: "permission-denied" });
      }
    } finally {
      setIsSwitchingCamera(false);
    }
  }, [state.kind, isSwitchingCamera, facingMode]);

  // ---- Pose loop: throttled framing evaluation ----
  const startPoseLoop = useCallback(() => {
    const tick = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const now = performance.now();
      try {
        const result = landmarker.detectForVideo(video, now);
        const lms: PoseLandmark[] = (result.landmarks?.[0] as PoseLandmark[]) || [];

        // Throttle to once per 200ms
        if (now - lastFramingTickRef.current >= 200) {
          lastFramingTickRef.current = now;
          const status = evaluateFraming(lms);
          setFraming(status);
        }
      } catch (err) {
        // Detection errors are non-fatal — keep looping
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // ---- Countdown ----
  const beginCountdown = useCallback(() => {
    if (framingRef.current.kind !== "ok") return;
    setState({ kind: "countdown", value: 3 });

    const step = (n: 3 | 2 | 1) => {
      countdownTimerRef.current = window.setTimeout(() => {
        // Re-check framing before each tick
        if (framingRef.current.kind !== "ok") {
          setState({ kind: "pre-recording" });
          return;
        }
        if (n === 1) {
          beginRecording();
        } else {
          const next = (n - 1) as 2 | 1;
          setState({ kind: "countdown", value: next });
          step(next);
        }
      }, 1000);
    };
    step(3);
  }, []);

  // ---- Recording ----
  const beginRecording = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;

    const mimeCandidates = ["video/mp4", "video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"];
    const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";

    let recorder: MediaRecorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch (err) {
      console.error("MediaRecorder init failed:", err);
      toast.error("Couldn't start recording. Try again.");
      setState({ kind: "pre-recording" });
      return;
    }

    recordChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordChunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordChunksRef.current, {
        type: mimeType || "video/webm",
      });
      uploadBlob(blob);
    };

    recorderRef.current = recorder;
    const startedAt = performance.now();
    recorder.start();
    setState({ kind: "recording", startedAt });
    setRecordSecondsLeft(15);

    // Auto-stop at 15s
    recordTimerRef.current = window.setTimeout(() => {
      stopRecording();
    }, RECORD_MAX_MS);

    // Tick the visible countdown
    recordTickerRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const left = Math.max(0, Math.ceil(15 - elapsed));
      setRecordSecondsLeft(left);
    }, 200);
  }, []);

  const stopRecording = useCallback(() => {
    if (recordTimerRef.current !== null) {
      clearTimeout(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (recordTickerRef.current !== null) {
      clearInterval(recordTickerRef.current);
      recordTickerRef.current = null;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        /* ignore */
      }
    }
    setState({ kind: "uploading" });
  }, []);

  // ---- Upload ----
  const uploadBlob = useCallback(
    async (blob: Blob) => {
      if (!reel) return;
      uploadAbortRef.current = new AbortController();
      const timeout = setTimeout(() => uploadAbortRef.current?.abort(), 30_000);

      try {
        const fd = new FormData();
        const ext = blob.type.includes("mp4") ? "mp4" : "webm";
        fd.append("file", blob, `attempt.${ext}`);
        fd.append("reel_id", reel.id);

        const res = await fetch(`${BACKEND_BASE}/reels/upload_recorded`, {
          method: "POST",
          body: fd,
          signal: uploadAbortRef.current.signal,
        });

        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        const payload = await res.json();

        // analyze_v2 payload — extract score defensively
        const score: number =
          payload?.score ??
          payload?.overall_score ??
          payload?.result?.score ??
          0;

        setState({ kind: "done" });
        onResult?.(reel.id, Math.round(score));
        handleClose();
      } catch (err) {
        if ((err as any)?.name === "AbortError") {
          // closed by user — handleClose already ran
          return;
        }
        console.error("Upload failed:", err);
        toast.error("Something went wrong. Try again.");
        setState({ kind: "pre-recording" });
      } finally {
        clearTimeout(timeout);
        uploadAbortRef.current = null;
      }
    },
    [reel, onResult, handleClose],
  );

  // ---- Lifecycle ----
  useEffect(() => {
    if (!isOpen) return;
    if (!isMobile) return;
    setupResources();
    return () => {
      cleanupAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isMobile, reel?.id]);

  // Track viewport dimensions of the camera container for skeleton scaling
  useEffect(() => {
    if (!isOpen) return;
    const measure = () => {
      const el = containerRef.current;
      if (el) {
        setViewport({ w: el.clientWidth, h: el.clientHeight });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [isOpen, state.kind]);

  // ---- Render helpers ----
  const renderDesktopGate = () => (
    <div className="space-y-6 py-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
        <Smartphone className="h-10 w-10 text-primary" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Open this on your phone</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Recording your attempt requires the rear camera. Open Caydence on your phone to try this reel.
        </p>
      </div>
      <Button onClick={handleClose} variant="secondary" className="w-full">
        Got it
      </Button>
    </div>
  );

  const renderPermissionDenied = () => (
    <div className="space-y-6 py-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Camera access needed</h3>
        <p className="text-sm text-muted-foreground">
          Allow camera access in your browser settings, then reload to record your attempt.
        </p>
      </div>
      <Button onClick={() => window.location.reload()} className="w-full">
        Reload
      </Button>
    </div>
  );

  const renderModelError = () => (
    <div className="space-y-6 py-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Couldn't load pose model</h3>
        <p className="text-sm text-muted-foreground">Check your connection and retry.</p>
      </div>
      <Button onClick={setupResources} className="w-full">
        Retry
      </Button>
    </div>
  );

  const renderRecorder = () => {
    const status = framing;
    const showGreen = status.kind === "ok";
    const isRecording = state.kind === "recording";
    const isCountdown = state.kind === "countdown";
    const isUploading = state.kind === "uploading";
    const isSetup = state.kind === "setup";

    const stopEnabled =
      isRecording && performance.now() - state.startedAt >= MIN_STOP_MS;

    return (
      <div className="space-y-3">
        <div
          ref={containerRef}
          className="relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-black"
        >
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="h-full w-full object-cover"
          />

          {/* Skeleton ghost overlay */}
          <SkeletonGhostOverlay
            skeleton={skeleton}
            viewportWidth={viewport.w}
            viewportHeight={viewport.h}
          />

          {/* Recording timer (top center) */}
          {isRecording && (
            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-3xl font-bold tabular-nums text-white">
              {recordSecondsLeft}
            </div>
          )}

          {/* Recording dot (top left) */}
          {isRecording && (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-white">REC</span>
            </div>
          )}

          {/* Framing status pill */}
          {!isRecording && !isCountdown && !isUploading && !isSetup && (
            <div
              className={`absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold ${
                showGreen
                  ? "bg-emerald-500/90 text-white"
                  : "bg-amber-500/90 text-white"
              }`}
            >
              {showGreen
                ? "Ready"
                : status.kind === "fail"
                  ? status.hint
                  : "Checking framing…"}
            </div>
          )}

          {/* Countdown overlay */}
          {isCountdown && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-[10rem] font-black leading-none text-white drop-shadow-2xl">
                {state.value}
              </span>
            </div>
          )}

          {/* Setup loading */}
          {isSetup && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-white/80">Preparing camera…</p>
            </div>
          )}

          {/* Uploading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-base font-semibold text-white">Analyzing your reel…</p>
            </div>
          )}
        </div>

        {/* Action button */}
        {state.kind === "pre-recording" && (
          <Button
            onClick={beginCountdown}
            disabled={!showGreen}
            className="h-12 w-full"
          >
            <Camera className="mr-2 h-4 w-4" />
            Record attempt
          </Button>
        )}
        {isRecording && (
          <Button
            onClick={stopRecording}
            disabled={!stopEnabled}
            variant="destructive"
            className="h-12 w-full"
          >
            <Square className="mr-2 h-4 w-4 fill-current" />
            {stopEnabled ? "Stop recording" : "Recording…"}
          </Button>
        )}
        {isCountdown && (
          <Button disabled className="h-12 w-full" variant="secondary">
            Get ready…
          </Button>
        )}
        {(isSetup || isUploading) && (
          <Button disabled className="h-12 w-full" variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSetup ? "Loading…" : "Uploading…"}
          </Button>
        )}
      </div>
    );
  };

  // Force a periodic re-render during recording so stopEnabled flips at 2s
  // (avoids needing a separate state slice for stop-button gating)
  useEffect(() => {
    if (state.kind !== "recording") return;
    const id = window.setInterval(() => setRecordSecondsLeft((s) => s), 200);
    return () => clearInterval(id);
  }, [state.kind]);

  const showFlipButton = isMobile && state.kind === "pre-recording";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="flex h-[100dvh] max-h-[100dvh] w-screen max-w-none translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-y-auto rounded-none border-0 bg-background p-0 sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-lg sm:border sm:border-border"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingLeft: "env(safe-area-inset-left)",
          paddingRight: "env(safe-area-inset-right)",
        }}
      >
        <DialogHeader className="shrink-0 px-4 pt-4 pr-20 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-start gap-2 pr-2 text-base leading-tight">
            <Camera className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="break-words">
              {reel ? `Record: ${reel.title}` : "Record your attempt"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {showFlipButton && (
          <button
            type="button"
            onClick={switchCamera}
            disabled={isSwitchingCamera}
            aria-label="Flip camera"
            className="absolute right-12 top-4 z-50 inline-flex h-8 w-8 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-30"
            style={{ top: "calc(env(safe-area-inset-top) + 1rem)" }}
          >
            <SwitchCamera className="h-4 w-4" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2 sm:px-6 sm:pb-6">
          {!isMobile
            ? renderDesktopGate()
            : state.kind === "permission-denied"
              ? renderPermissionDenied()
              : state.kind === "model-error"
                ? renderModelError()
                : renderRecorder()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadAttemptModal;
