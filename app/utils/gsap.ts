import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Guarded so prerender (node) never touches browser APIs.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, useGSAP);
  if (import.meta.env.DEV) {
    // console debugging only
    (window as any).ScrollTrigger = ScrollTrigger;
    (window as any).gsap = gsap;
  }
}

// page-intro gate: timed intros play only on the first paint of a full load;
// client-side navigations transition via the view-transition crossfade instead
// (replaying them mid-crossfade double-animates the very elements VT morphs).
// root.tsx flips this in a passive effect, which runs after every layout
// effect of the initial tree — so first-load consumers still read `true`.
let firstLoad = true;
export const isFirstLoad = () => firstLoad;
export const endFirstLoad = () => {
  firstLoad = false;
};

/**
 * ScrollTrigger `end` giving a fixed px scrub window after a clamped start.
 * Neither `"+=N"` (resolves against the unclamped start) nor
 * `(self) => self.start + N` (start isn't populated yet during refresh)
 * survives an above-fold trigger, so recompute the clamped start here.
 */
export const scrubWindow =
  (px: number, startViewport = 0.7) => (self: { trigger?: Element }) => {
    const top = self.trigger
      ? self.trigger.getBoundingClientRect().top + window.scrollY
      : 0;
    const start = Math.max(0, top - window.innerHeight * startViewport);
    // never scrub past the page bottom, or the draw could never finish
    return Math.min(start + px, ScrollTrigger.maxScroll(window));
  };

export { gsap, ScrollSmoother, ScrollTrigger, SplitText, useGSAP };
