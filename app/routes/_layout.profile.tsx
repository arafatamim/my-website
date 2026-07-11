import "../styles/profile.scss";
import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import {
  SiDocker,
  SiFlutter,
  SiFsharp,
  SiGit,
  SiGo,
  SiJetpackcompose,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import siteMetadata, { absoluteUrl } from "../meta";
import Marquee from "../components/Marquee";
import { gsap, scrubWindow, SplitText, useGSAP } from "../utils/gsap";
import { useMagnetic } from "../utils/useMagnetic";

export function meta() {
  const url = absoluteUrl("/profile");
  const title = "Profile — Tamim Arafat";
  const description =
    "Tamim Arafat — Full-stack and mobile developer specializing in React, TypeScript, Node.js, Python, Go, and mobile development with Flutter and Jetpack Compose.";

  return [
    { title },
    { name: "description", content: description },
    { rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "profile" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteMetadata.title },
    { property: "og:image", content: absoluteUrl("/og-image.png") },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:image", content: absoluteUrl("/og-image.png") },
    { name: "twitter:site", content: "@_arafatamim_" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Tamim Arafat",
        jobTitle: "Full-stack and Mobile Developer",
        url,
        sameAs: [
          siteMetadata.socialLinks.github,
          siteMetadata.socialLinks.linkedIn,
          siteMetadata.socialLinks.x,
          siteMetadata.socialLinks.facebook,
          siteMetadata.socialLinks.instagram,
        ],
        knowsAbout: [
          "TypeScript",
          "React",
          "React Native",
          "Node.js",
          "Next.js",
          "Python",
          "Go",
          "Rust",
          "Docker",
          "Git",
          "MongoDB",
          "PostgreSQL",
          "Tailwind CSS",
          "Flutter",
          "Jetpack Compose",
          "F#",
        ],
      },
    },
  ];
}

export default function ProfileTab() {
  const scope = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(ctaRef, 0.2);

  // nav-bar arrivals land below the hero, straight at the content
  // (passive effect: runs after ScrollRestoration's layout-effect top reset)
  const { state } = useLocation();
  useEffect(() => {
    if (!(state as { fromNav?: boolean } | null)?.fromNav) return;
    const hero = document.querySelector<HTMLElement>(".header");
    if (hero) window.scrollTo(0, hero.offsetTop + hero.offsetHeight);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 768px)",
        },
        (self) => {
          if (!self.conditions?.motionOk) return;
          const isMobile = self.conditions.isMobile;

        // CSS hides .profile until JS takes over (no flash of unanimated content)
        gsap.set(scope.current, { visibility: "visible" });

        // headline: word-by-word masked rise
        SplitText.create(".profile__title", {
          type: "words",
          mask: "words",
          onSplit: (self) =>
            gsap.from(self.words, {
              yPercent: 110,
              duration: 0.7,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".profile__title-wrapper",
                start: "top 88%",
              },
            }),
        });

        // hand-drawn underline. pathLength=1 puts the whole draw inside 0–1px;
        // GSAP's px rounding would snap it to the end, so autoRound is off.
        // desktop: drawn by the scroll position itself (clamp keeps it undrawn
        // on load even above the fold). mobile: a one-shot draw on viewport enter.
        gsap.fromTo(
          ".profile__underline path",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            autoRound: false,
            ...(isMobile
              ? {
                duration: 0.9,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".profile__title-wrapper",
                  start: "top 80%",
                },
              }
              : {
                ease: "none",
                scrollTrigger: {
                  trigger: ".profile__title-wrapper",
                  start: "clamp(top 70%)", // keep in sync with scrubWindow's startViewport
                  end: scrubWindow(480),
                  scrub: true,
                },
              }),
          },
        );

        // proof stats: counters rise in with stagger
        gsap.from(".profile__stats__item", {
          y: 28,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".profile__stats", start: "top 85%" },
        });

        // bio: ink writes itself on, word by word, scrubbed to the scroll
        gsap.from(".profile__body .profile__kicker", {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".profile__body", start: "top 85%" },
        });
        SplitText.create(".profile__body__bio", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              opacity: 0.12,
              stagger: 0.05,
              ease: "none",
              scrollTrigger: {
                trigger: ".profile__body__bio",
                start: "top 80%",
                end: "bottom 45%",
                scrub: true,
              },
            }),
        });

        // skills: heading, then the grid cascades in
        // (set + to instead of from: from() inside a triggered timeline can
        // re-render its start state on ScrollTrigger.refresh and stick there)
        gsap.set(".profile__skills .profile__kicker", {
          y: 28,
          autoAlpha: 0,
        });
        gsap.set(".profile__skills .prose", { y: 22, autoAlpha: 0 });
        gsap.set(".profile__skills__list__item", {
          y: 36,
          autoAlpha: 0,
          scale: 0.94,
        });
        const skillsTl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: ".profile__skills", start: "top 80%" },
        });
        skillsTl
          .to(".profile__skills .profile__kicker", {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
          })
          .to(
            ".profile__skills .prose",
            { y: 0, autoAlpha: 1, duration: 0.6 },
            "-=0.4",
          )
          .to(
            ".profile__skills__list__item",
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.045,
            },
            "-=0.35",
          );

        // ink stroke: brush divider draws itself in with the scroll
        gsap.fromTo(
          ".profile__ink-stroke path",
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            autoRound: false, // sub-pixel draw (pathLength=1)
            scrollTrigger: {
              trigger: ".profile__ink-stroke",
              start: "top 92%",
              end: "top 55%",
              scrub: true,
            },
          },
        );

        // closing CTA: rises in, drifts gently on scroll for depth
        gsap.from(".profile__cta > *", {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".profile__cta", start: "top 85%" },
        });
        gsap.fromTo(
          ".profile__cta",
          { yPercent: 8 },
          {
            yPercent: -4,
            ease: "none",
            scrollTrigger: {
              trigger: ".profile__cta",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope },
  );

  return (
    <div className="profile" ref={scope}>
      <div className="profile__title-wrapper">
        <h1 className="profile__title">
          Full-stack and mobile developer
        </h1>
        <svg
          className="profile__underline"
          viewBox="0 -25 400 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 5 C5 -12, 10 22, 15 5 C22 -18, 30 28, 38 5 C45 -10, 55 20, 65 5 C75 -22, 90 32, 105 5 C118 -15, 135 25, 150 5 C165 -20, 185 30, 205 5 C222 -12, 242 22, 260 5 C278 -18, 300 28, 320 5 C338 -10, 355 20, 375 5 C388 -15, 395 25, 400 5"
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
      </div>

      <ul className="profile__stats">
        {[
          { value: "5+", label: "years building for web & mobile" },
          { value: "10", label: "projects designed, built & shipped" },
          { value: "∞", label: "curiosity for how things work" },
        ].map((stat) => (
          <li className="profile__stats__item" key={stat.label}>
            <span className="profile__stats__item__value">{stat.value}</span>
            <span className="profile__stats__item__label">{stat.label}</span>
          </li>
        ))}
      </ul>

      <section className="profile__body">
        <h2 className="profile__kicker">01 — About</h2>
        <p className="profile__body__bio prose">
          I started programming at 14 with QuickBASIC and never really stopped.
          Since then I've worked with JavaScript, Dart, Python, Go, and I'm
          currently learning Rust. For the past five years I've been building
          web and mobile apps — sometimes for work, mostly because I genuinely
          enjoy it. I also dabble in 3D, graphic design, and video editing. When
          I'm not at a screen, I'm usually tinkering with something or figuring
          out how things work.
        </p>
      </section>

      <Marquee
        text="developer · designer · tinkerer · open source contributor · philomath · autodidact"
        className="profile__marquee"
      />

      <section className="profile__skills">
        <h2 className="profile__kicker">02 — Toolkit</h2>
        <p className="prose">List of skills, tools and technologies I use:</p>
        <ul className="profile__skills__list">
          {[
            { icon: SiTypescript, name: "TypeScript" },
            { icon: SiReact, name: "React + Native" },
            { icon: SiNodedotjs, name: "Node.js" },
            { icon: SiNextdotjs, name: "Next.js" },
            { icon: SiPython, name: "Python" },
            { icon: SiGo, name: "Go" },
            { icon: SiRust, name: "Rust" },
            { icon: SiDocker, name: "Docker" },
            { icon: SiGit, name: "Git" },
            { icon: SiMongodb, name: "MongoDB" },
            { icon: SiPostgresql, name: "PostgreSQL" },
            { icon: SiTailwindcss, name: "Tailwind" },
            { icon: SiFlutter, name: "Flutter" },
            { icon: SiJetpackcompose, name: "Jetpack Compose" },
            { icon: SiFsharp, name: "F#" },
          ].map((skill, index) => (
            <li key={index} className="profile__skills__list__item">
              <skill.icon size={32} />
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <svg
        className="profile__ink-stroke"
        viewBox="0 0 400 30"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M8 18 C60 6, 120 26, 200 14 C270 4, 330 24, 392 12"
          fill="none"
          stroke="var(--accent-2)"
          strokeWidth="9"
          strokeLinecap="round"
          pathLength="1"
          filter="url(#brush-stroke)"
        />
      </svg>

      <section className="profile__cta">
        <p className="profile__cta__kicker">Have a project in mind?</p>
        <Link
          to="/contact"
          className="profile__cta__link"
          viewTransition
          ref={ctaRef}
        >
          Let's build something together{" "}
          <span className="profile__cta__arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </section>
    </div>
  );
}
