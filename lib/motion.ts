import gsap from "gsap";

/** Synchronous check for reduced-motion preference. SSR-safe (returns false on server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface MotionBranches {
  /** Build the full scroll-driven timeline. Runs only when motion is allowed. */
  animated: () => void;
  /** Snap to the final visual state instantly. No timelines, no pin. */
  reduced: () => void;
}

/**
 * Gate every scroll timeline behind prefers-reduced-motion via gsap.matchMedia().
 * matchMedia auto-cleans the matching branch when the media query stops matching
 * (and useGSAP reverts it on unmount when scoped). Reduced-motion is a first-class
 * path, not an afterthought (docs/research.md §1).
 *
 * @param scope optional element scope so selectors resolve locally and revert cleanly.
 */
export function withMotionPreference(
  branches: MotionBranches,
  scope?: Element | null,
): gsap.MatchMedia {
  const mm = scope ? gsap.matchMedia(scope) : gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", branches.animated);
  mm.add("(prefers-reduced-motion: reduce)", branches.reduced);
  return mm;
}
