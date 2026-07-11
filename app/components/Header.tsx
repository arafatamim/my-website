import { FaFacebook, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import siteMetadata from "../meta";
import avatar from "../assets/img/me.jpg";
import "./Header.scss";
import { NavLink } from "react-router";
import { useRef } from "react";
import { gsap, isFirstLoad, SplitText, useGSAP } from "../utils/gsap";
import { useMagnetic } from "../utils/useMagnetic";

export default function Header({ collapsed }: { collapsed: boolean }) {
  const scope = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(buttonRef);

  const [firstName, lastName] = siteMetadata.title.split(" ");

  useGSAP(
    () => {
      if (!scope.current) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // CSS hides .header until JS takes over (no flash of unanimated content)
        gsap.set(scope.current, { visibility: "visible" });

        // intro choreography only on a cold load; on client-side navigation
        // the view transition morphs the title, so animating it too fights it
        if (isFirstLoad()) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.from(
            ".header__top > *",
            { y: -18, autoAlpha: 0, duration: 0.7, stagger: 0.15 },
            0.2,
          )
            .from(
              ".header__hero__main-image img",
              {
                clipPath: "circle(0% at 50% 50%)",
                scale: 1.3,
                duration: 1.1,
                ease: "power2.inOut",
              },
              0.35,
            )
            .from(
              ".header__bottom > *",
              { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.12 },
              1.1,
            );

          // name: per-character ink-settle rise (blur clears as the type lands)
          SplitText.create(".header__hero__title__line", {
            type: "chars",
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 70,
                autoAlpha: 0,
                rotateX: -35,
                filter: "blur(12px)",
                transformOrigin: "50% 100%",
                duration: 1.1,
                stagger: 0.04,
                ease: "power3.out",
                delay: 0.35,
              }),
          });
        }

        // subtle idle float on the avatar
        gsap.to(".header__hero__main-image img", {
          y: -10,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.6,
        });

        // parallax: type drifts and fades as the hero scrolls out
        gsap.to(".header__hero__title", {
          yPercent: 22,
          autoAlpha: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(".header__bottom", {
          yPercent: 40,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope, dependencies: [collapsed], revertOnUpdate: true },
  );

  if (!collapsed) {
    return (
      <div className="header" ref={scope}>
        <div className="header__top">
          <ul className="header__socials">
            {[
              {
                name: "LinkedIn",
                href: siteMetadata.socialLinks.linkedIn,
                icon: <FaLinkedin />,
              },
              {
                name: "X (formerly Twitter)",
                href: siteMetadata.socialLinks.x,
                icon: <FaXTwitter />,
              },
              {
                name: "Facebook",
                href: siteMetadata.socialLinks.facebook,
                icon: <FaFacebook />,
              },
            ].map((social) => (
              <li className="header__socials__item" key={social.name}>
                <a
                  className="header__socials__link"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="header__hero__title" aria-label={siteMetadata.title}>
          <span className="header__hero__title__row">
            <span className="header__hero__title__line">{firstName}</span>
            <span className="header__hero__main-image">
              <img src={avatar} width={176} height={176} alt="" />
            </span>
          </span>
          <span className="header__hero__title__line header__hero__title__line--last">
            {lastName}
          </span>
        </div>

        <div className="header__bottom">
          <p className="header__hero__subtitle">
            I build fast, polished web &amp; mobile apps
            <br />
            that people enjoy using.
          </p>
          <div className="header__hero__main-button">
            <a
              href={siteMetadata.socialLinks.github}
              className="header__hero__main-button__link"
              target="_blank"
              rel="noopener noreferrer"
              ref={buttonRef}
            >
              <FaGithub />
              &nbsp;See my work on GitHub
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="collapsed-hero">
        {/* straight to /profile: "/" is a document redirect (full reload) */}
        <NavLink to="/profile" className="collapsed-hero__link" viewTransition>
          <div className="collapsed-hero__header">
            <img
              className="collapsed-hero__header__brand-image"
              src={avatar}
              alt={siteMetadata.title}
              aria-hidden="true"
              height="72px"
              width="72px"
            />
            <span
              className="collapsed-hero__header__site-name"
              style={{ animationDelay: "0.2s" }}
            >
              {siteMetadata.title}
            </span>
          </div>
        </NavLink>
      </div>
    );
  }
}
