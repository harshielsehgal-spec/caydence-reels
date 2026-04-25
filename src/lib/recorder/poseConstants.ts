// MediaPipe pose landmark indices and connections
export const POSE = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

// Required pose connections per spec
export const POSE_CONNECTIONS: ReadonlyArray<readonly [number, number]> = [
  // Torso
  [11, 12], [11, 23], [12, 24], [23, 24],
  // Left arm
  [11, 13], [13, 15],
  // Right arm
  [12, 14], [14, 16],
  // Left leg
  [23, 25], [25, 27],
  // Right leg
  [24, 26], [26, 28],
  // Head to shoulders
  [0, 11], [0, 12],
];

export const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

export const WASM_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm";

export const BACKEND_BASE = "https://caydence-reels-backend.onrender.com";

export interface SkeletonLandmark {
  index: number;
  x: number;
  y: number;
  visibility: number;
}

export interface SkeletonData {
  frame_index: number;
  landmarks: SkeletonLandmark[];
  width: number;
  height: number;
}

export type FramingStatus =
  | { kind: "pending" }
  | { kind: "ok" }
  | { kind: "fail"; hint: string };

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/** Evaluate the three framing checks. Returns first-failing hint (priority order) or ok. */
export function evaluateFraming(landmarks: PoseLandmark[]): FramingStatus {
  if (!landmarks || landmarks.length < 29) {
    return { kind: "fail", hint: "Step back — show your full body" };
  }

  const vis = (i: number) => landmarks[i]?.visibility ?? 0;

  // 1. Full body in frame: nose, both ankles visible
  if (vis(POSE.NOSE) <= 0.5 || vis(POSE.LEFT_ANKLE) <= 0.5 || vis(POSE.RIGHT_ANKLE) <= 0.5) {
    return { kind: "fail", hint: "Step back — show your full body" };
  }

  // 2. Centered horizontally
  const ls = landmarks[POSE.LEFT_SHOULDER];
  const rs = landmarks[POSE.RIGHT_SHOULDER];
  const midX = (ls.x + rs.x) / 2;
  if (midX < 0.2 || midX > 0.8) {
    return { kind: "fail", hint: "Center yourself" };
  }

  // 3. Primary landmarks visible
  const primary = [11, 12, 23, 24, 25, 26];
  for (const idx of primary) {
    if (vis(idx) <= 0.7) {
      return { kind: "fail", hint: "Improve lighting" };
    }
  }

  return { kind: "ok" };
}
