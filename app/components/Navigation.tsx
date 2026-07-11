import { Link, useLocation } from "react-router";
import { useRef } from "react";
import "./Navigation.scss";
import { normalizePathname } from "../utils/path";
import { gsap, ScrollTrigger, useGSAP } from "../utils/gsap";

interface NavItem {
  path: string;
  label: string;
}

export function Navigation({ navItems }: { navItems: NavItem[] }) {
  const pathname = normalizePathname(useLocation().pathname);
  const scope = useRef<HTMLElement>(null);

  // on the hero page the rail would sit on top of the giant name,
  // so it only fades in once the hero has scrolled away
  useGSAP(
    () => {
      const hero = document.querySelector(".header");
      if (!hero || !scope.current) return;
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
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <nav className="nav" ref={scope}>
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
