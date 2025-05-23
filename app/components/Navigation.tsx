import { Link, useLocation, useNavigation } from "react-router";
import { useEffect, useRef } from "react";
import "./Navigation.scss";
import "animate.css";

interface NavItem {
  path: string;
  label: string;
}

export function Navigation({ navItems }: { navItems: NavItem[] }) {
  const location = useLocation();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLLIElement>(null);

  const updateIndicator = () => {
    const activeItem = activeItemRef.current;
    const indicator = indicatorRef.current;

    if (activeItem && indicator) {
      const width = activeItem.offsetWidth;
      const height = activeItem.offsetHeight;
      const left = activeItem.offsetLeft;
      const top = activeItem.offsetTop;

      indicator.style.width = `${width}px`;
      indicator.style.height = `${height}px`;
      indicator.style.setProperty("--translateX", `${left}px`);
      indicator.style.setProperty("--translateY", `${top}px`);
      indicator.style.transform = `translate3d(${left}px, ${top}px, 0)`;

      indicator.style.opacity = "1";
    } else if (indicator) {
      indicator.style.opacity = "0";
    }
  };

  useEffect(() => {
    let animationFrameId: number;
    let resizeObserver: ResizeObserver | null = null;

    const runInitialUpdate = () => {
      updateIndicator();

      const activeItem = activeItemRef.current;
      if (activeItem) {
        resizeObserver = new ResizeObserver(() => {
          updateIndicator();
        });
        resizeObserver.observe(activeItem);
      }
    };

    animationFrameId = requestAnimationFrame(runInitialUpdate);

    // update on window resize
    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateIndicator);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [location]);

  const activeClass = (path: string) =>
    location.pathname === path ? "nav__item--active" : "";

  return (
    <nav className="nav animate__animated animate__fadeInUp animate__faster">
      <ul className="nav__ul">
        <div
          className="nav__item--active-indicator"
          ref={indicatorRef}
          style={{ opacity: 0 }}
        />
        {navItems.map((item) => (
          <li
            key={item.path}
            className={`nav__item ${activeClass(item.path)}`}
            ref={location.pathname === item.path ? activeItemRef : null}
          >
            <Link
              className="nav__item__link"
              to={item.path}
              preventScrollReset={true}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
