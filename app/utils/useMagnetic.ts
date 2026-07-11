import { useEffect } from "react";
import { gsap } from "./gsap";

/** Wire the cursor-follow behaviour onto a single element. Returns a cleanup. */
function attachMagnetic(el: HTMLElement, strength: number) {
  const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

  const move = (e: MouseEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener("mousemove", move);
  el.addEventListener("mouseleave", leave);
  return () => {
    el.removeEventListener("mousemove", move);
    el.removeEventListener("mouseleave", leave);
  };
}

/** True when magnetism should be skipped (reduced motion or no true hover). */
function magneticDisabled() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.matchMedia("(hover: hover)").matches
  );
}

/** Element gently follows the cursor while hovered, springs back on leave. */
export function useMagnetic<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  strength = 0.3,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || magneticDisabled()) return;
    return attachMagnetic(el, strength);
  }, [ref, strength]);
}

/**
 * Apply the magnetic effect to every element matching `selector` within
 * `scope`. Handy for conditional or mapped groups where per-element refs would
 * be awkward. Re-binds whenever the given dependencies change.
 */
export function useMagneticAll<T extends HTMLElement>(
  scope: React.RefObject<T | null>,
  selector: string,
  strength = 0.3,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const root = scope.current;
    if (!root || magneticDisabled()) return;
    const cleanups = Array.from(
      root.querySelectorAll<HTMLElement>(selector),
    ).map((el) => attachMagnetic(el, strength));
    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, selector, strength, ...deps]);
}
