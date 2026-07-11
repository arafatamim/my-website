import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../utils/gsap";
import "./Marquee.scss";

/** Infinite text marquee; speeds up with scroll velocity. Decorative only. */
export default function Marquee({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(".marquee__inner", {
          xPercent: -100,
          repeat: -1,
          duration: 28,
          ease: "none",
        });

        let speed = 1;
        ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            speed = gsap.utils.clamp(
              1,
              5,
              1 + Math.abs(self.getVelocity()) / 400,
            );
          },
        });

        // ease speed back to 1 when scrolling stops
        const tick = () => {
          speed += (1 - speed) * 0.05;
          tween.timeScale(speed);
        };
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
      });
    },
    { scope },
  );

  const content = Array(4).fill(text).join(" · ") + " · ";

  return (
    <div
      className={`marquee${className ? ` ${className}` : ""}`}
      ref={scope}
      aria-hidden="true"
    >
      <div className="marquee__inner">{content}</div>
      <div className="marquee__inner">{content}</div>
    </div>
  );
}
