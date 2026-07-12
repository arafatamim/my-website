import { Link, useLocation } from "react-router";
import { useRef } from "react";
import "./Navigation.scss";
import { normalizePathname } from "../utils/path";
import { gsap, ScrollTrigger, useGSAP } from "../utils/gsap";

interface NavItem {
  path: string;
  label: string;
}

export function Navigation({
  navItems,
  variant = "rail",
}: {
  navItems: NavItem[];
  variant?: "rail" | "bar";
}) {
  const pathname = normalizePathname(useLocation().pathname);
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!scope.current) return;

      // Desktop rail: it would sit on top of the giant hero name, so fade it
      // in only once the hero has scrolled away.
      if (variant === "rail") {
        const hero = document.querySelector(".header");
        if (!hero) return;
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1025px)", () => {
          gsap.set(scope.current, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: hero,
            start: "bottom 55%",
            onEnter: () =>
              gsap.to(scope.current, { autoAlpha: 1, duration: 0.5 }),
            onLeaveBack: () =>
              gsap.to(scope.current, { autoAlpha: 0, duration: 0.3 }),
          });
        });
        return;
      }

      // Mobile bar: on touch devices ScrollSmoother uses native scroll (no
      // transform), so CSS `position: sticky` sticks natively and stays GPU-
      // composited. A ScrollTrigger pin there falls back to position:fixed and
      // jitters against momentum scroll — so pin only on non-touch narrow
      // viewports, where the smoothing transform is what breaks sticky.
      if (ScrollTrigger.isTouch === 1) return;
      const mm = gsap.matchMedia();
      mm.add(
        "(max-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // neutralize the CSS sticky so the pin's math starts from flow
          gsap.set(scope.current, { position: "relative", top: "auto" });
          ScrollTrigger.create({
            trigger: scope.current,
            start: "top 10px", // pin ~0.6rem below the top, matching the sticky gap
            end: "max",
            pin: true,
            pinSpacing: false,
          });
        },
      );
    },
    { scope, dependencies: [pathname, variant], revertOnUpdate: true },
  );

  return (
    <nav className={`nav nav--${variant}`} ref={scope}>
      <ul className="nav__ul">
        {navItems.map((item) => (
          <li key={item.path} className="nav__item">
            <Link
              className={`nav__item__link ${
                pathname === item.path ? "nav__item__link--active" : ""
              }`}
              to={item.path}
              state={{ fromNav: true }}
              viewTransition
              aria-current={pathname === item.path ? "page" : undefined}
            >
              <span className="nav__item__dash" aria-hidden="true" />
              <span className="nav__item__label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
