import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "../utils/gsap";

/** Lenis smooth scrolling, synced with GSAP ScrollTrigger. Renders nothing. */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // on navigation, kill any in-flight easing and adopt the position the
  // router (or a route effect) just set — otherwise Lenis keeps animating
  // toward the previous page's scroll target and drags the new page there.
  // This effect runs after the route effects: this component sits after
  // {children} in root, and passive effects fire in tree order.
  useEffect(() => {
    lenisRef.current?.scrollTo(window.scrollY, {
      immediate: true,
      force: true,
    });
  }, [pathname]);

  return null;
}
