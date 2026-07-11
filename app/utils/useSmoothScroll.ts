import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router";
import { ScrollSmoother, ScrollTrigger } from "./gsap";

// useLayoutEffect warns during prerender (no DOM). The restore must run before
// paint to avoid a flash at the wrong offset, so keep it a layout effect in the
// browser and degrade to useEffect on the server (where it no-ops anyway).
const useIsoLayoutEffect = typeof window !== "undefined"
  ? useLayoutEffect
  : useEffect;

/**
 * GSAP ScrollSmoother + our own scroll restoration. Call once, in the root
 * layout. Renders nothing — this is why it's a hook, not a component.
 *
 * We deliberately do NOT use React Router's <ScrollRestoration>: it restores
 * onto native scroll, which clamps to the page's current (half-built) height —
 * a long GSAP page grows asynchronously (pin-spacing, lazy images), so a deep
 * offset lands ~500px down and never recovers. Owning it lets us re-assert the
 * un-clamped target as the page grows, and keeps a single scroll authority.
 */
export function useSmoothScroll() {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const location = useLocation();
  const navType = useNavigationType();
  // scroll offset per history entry, our source of truth for back/forward.
  const positions = useRef<Map<string, number>>(new Map());
  const activeKey = useRef(location.key);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const smoother = ScrollSmoother.create({ smooth: 1.2, effects: false });
    smootherRef.current = smoother;
    return () => {
      smoother.kill();
      smootherRef.current = null;
    };
  }, []);

  // record where the current entry sits as it scrolls, keyed by history entry.
  // capped so a long session can't grow the map without bound — you'd never
  // back-button 50 entries deep, and Map keeps insertion order so we evict the
  // oldest. ScrollSmoother keeps native scroll, so window.scrollY is truthful.
  useEffect(() => {
    const save = () => {
      const map = positions.current;
      map.set(activeKey.current, window.scrollY);
      if (map.size > 50) map.delete(map.keys().next().value!);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, []);

  // Own the whole restore/reset job in one layout effect. It runs before route
  // passive effects, so a route can still override the landing spot on a fresh
  // nav (e.g. profile's fromNav jump past the hero). No render-phase key hack:
  // we're the only thing that moves scroll on navigation, so any scroll event
  // fires under the already-updated key.
  useIsoLayoutEffect(() => {
    activeKey.current = location.key;
    const samePage = location.pathname === prevPath.current;
    prevPath.current = location.pathname;
    const setTop = (y: number) => {
      const s = smootherRef.current;
      if (s) s.scrollTop(y);
      else window.scrollTo(0, y);
    };

    // fresh nav (PUSH/REPLACE) → top; a route effect may reposition after.
    // But a same-pathname change (e.g. a tag filter editing only the query)
    // should stay in place — this is what preventScrollReset asks for, which
    // our own restoration has to honor since we replaced <ScrollRestoration>.
    if (navType !== "POP") {
      if (!samePage) setTop(0);
      return;
    }

    // back/forward → the saved offset. The page's full height builds async
    // (ScrollTrigger pin-spacing, lazy images), so the target may not exist
    // yet — re-assert as the content grows, until it's tall enough to hold it.
    const target = positions.current.get(location.key) ?? 0;
    const apply = () => {
      ScrollTrigger.refresh();
      setTop(target);
    };
    apply();
    if (target === 0) return;

    const content = document.getElementById("smooth-content") ?? document.body;
    const ro = new ResizeObserver(() => {
      setTop(target);
      if (ScrollTrigger.maxScroll(window) >= target) ro.disconnect();
    });
    ro.observe(content);
    const stop = setTimeout(() => ro.disconnect(), 1500);
    return () => {
      ro.disconnect();
      clearTimeout(stop);
    };
  }, [location.key, navType]);
}
