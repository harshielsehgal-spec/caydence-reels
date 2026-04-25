import { BACKEND_BASE, SkeletonData } from "./poseConstants";

/**
 * Fetch the cached creator skeleton for a reel. Silent failure — returns null on
 * 404, network error, or 10s timeout. Caller continues without the ghost overlay.
 */
export async function fetchReelSkeleton(
  referenceId: string,
  externalSignal: AbortSignal,
): Promise<SkeletonData | null> {
  const ctl = new AbortController();
  const onAbort = () => ctl.abort();
  externalSignal.addEventListener("abort", onAbort);
  const timeout = setTimeout(() => ctl.abort(), 10_000);

  try {
    const res = await fetch(`${BACKEND_BASE}/reels/${encodeURIComponent(referenceId)}/skeleton`, {
      signal: ctl.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as SkeletonData;
    if (!json?.landmarks?.length) return null;
    return json;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
    externalSignal.removeEventListener("abort", onAbort);
  }
}
