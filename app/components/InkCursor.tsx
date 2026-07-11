import { useRef } from "react";
import { gsap, useGSAP } from "../utils/gsap";
import "./InkCursor.scss";

/** Trailing ink dot; the native cursor stays. Decorative only. */
export default function InkCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const dot = dotRef.current;
        if (!dot) return;
        const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
        const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });

        let shown = false;
        const move = (e: MouseEvent) => {
          if (!shown) {
            shown = true;
            gsap.to(dot, { autoAlpha: 1, duration: 0.2 });
          }
          xTo(e.clientX);
          yTo(e.clientY);
        };
        // grow over anything interactive
        const over = (e: MouseEvent) => {
          const interactive = (e.target as Element).closest?.("a, button");
          gsap.to(dot, { scale: interactive ? 3 : 1, duration: 0.3 });
        };
        const leave = () => {
          shown = false;
          gsap.to(dot, { autoAlpha: 0, duration: 0.2 });
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseover", over);
        document.documentElement.addEventListener("mouseleave", leave);
        return () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseover", over);
          document.documentElement.removeEventListener("mouseleave", leave);
        };
      },
    );
  });

  return <div className="ink-cursor" ref={dotRef} aria-hidden="true" />;
}
