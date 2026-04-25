import { useMemo } from "react";
import { POSE_CONNECTIONS, SkeletonData } from "@/lib/recorder/poseConstants";

interface Props {
  skeleton: SkeletonData | null;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * SVG ghost overlay rendered at ~40% opacity, scaled with object-fit: contain
 * semantics so the silhouette never stretches across mismatched aspect ratios.
 */
const SkeletonGhostOverlay = ({ skeleton, viewportWidth, viewportHeight }: Props) => {
  const projected = useMemo(() => {
    if (!skeleton || !viewportWidth || !viewportHeight) return null;

    const { landmarks, width: skW, height: skH } = skeleton;
    const scale = Math.min(viewportWidth / skW, viewportHeight / skH);
    const drawW = skW * scale;
    const drawH = skH * scale;
    const offsetX = (viewportWidth - drawW) / 2;
    const offsetY = (viewportHeight - drawH) / 2;

    // landmarks are in 0-1 normalized space relative to skeleton width/height
    const points = new Map<number, { x: number; y: number }>();
    for (const lm of landmarks) {
      points.set(lm.index, {
        x: offsetX + lm.x * skW * scale,
        y: offsetY + lm.y * skH * scale,
      });
    }
    return points;
  }, [skeleton, viewportWidth, viewportHeight]);

  if (!projected) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      width={viewportWidth}
      height={viewportHeight}
      style={{ opacity: 0.4 }}
    >
      {POSE_CONNECTIONS.map(([a, b], i) => {
        const pa = projected.get(a);
        const pb = projected.get(b);
        if (!pa || !pb) return null;
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
      {Array.from(projected.values()).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="hsl(var(--primary))" />
      ))}
    </svg>
  );
};

export default SkeletonGhostOverlay;
