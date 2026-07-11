import "../styles/profile.scss";
import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigationType } from "react-router";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
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
import siteMetadata, { absoluteUrl, buildMeta } from "../meta";
import Marquee from "../components/Marquee";
import {
  gsap,
  ScrollSmoother,
  ScrollTrigger,
  scrubWindow,
  SplitText,
  useGSAP,
} from "../utils/gsap";
import grainTexture from "../assets/img/white-texture.webp";
import { useMagnetic } from "../utils/useMagnetic";
import projects from "../content/projects/projects.json";
import { getProjectImage } from "../utils/projectImages";

// one per discipline: mobile OSS, Flutter app, client web.
// phone: portrait screen recording — contained on a panel, not cover-cropped
const FEATURED = [
  { slug: "ferngeist", phone: false },
  { slug: "amar-rapid-pass", phone: true },
  { slug: "freight-away", phone: false },
].map(({ slug, phone }) => ({
  ...projects.find((p) => p.slug === slug)!,
  phone,
}));

const SKILL_GROUPS = [
  {
    label: "Web",
    skills: [
      { icon: SiTypescript, name: "TypeScript" },
      { icon: SiReact, name: "React" },
      { icon: SiNextdotjs, name: "Next.js" },
      { icon: SiNodedotjs, name: "Node.js" },
      { icon: SiTailwindcss, name: "Tailwind" },
    ],
  },
  {
    label: "Mobile",
    skills: [
      { icon: SiFlutter, name: "Flutter" },
      { icon: SiJetpackcompose, name: "Jetpack Compose" },
      { icon: SiReact, name: "React Native" },
    ],
  },
  {
    label: "Languages",
    skills: [
      { icon: SiPython, name: "Python" },
      { icon: SiGo, name: "Go" },
      { icon: SiRust, name: "Rust" },
      { icon: SiFsharp, name: "F#" },
    ],
  },
  {
    label: "Data & tooling",
    skills: [
      { icon: SiMongodb, name: "MongoDB" },
      { icon: SiPostgresql, name: "PostgreSQL" },
      { icon: SiDocker, name: "Docker" },
      { icon: SiGit, name: "Git" },
    ],
  },
];

export function meta() {
  const url = absoluteUrl("/profile");
  // name-first, role-forward: this is the canonical landing page (/ → 301),
  // so the title has to earn the SERP click, not read like a tab label.
  const title = "Tamim Arafat — Full-Stack & Mobile Developer";
  const description =
    "Tamim Arafat — Full-stack and mobile developer specializing in React, TypeScript, Node.js, Python, Go, and mobile development with Flutter and Jetpack Compose.";

  return buildMeta({
    title,
    description,
    path: "/profile",
    ogType: "profile",
    jsonLd: {
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
  });
}

export default function ProfileTab() {
  const scope = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(ctaRef, 0.2);

  // nav-bar arrivals land below the hero, straight at the content. Passive
  // effect: runs after SmoothScroll's layout-effect top reset, so we override
  // it here. Skip on POP (back/forward): the fromNav flag is baked into the
  // history entry, so without this guard returning to profile would re-skip
  // the hero and clobber the scroll position SmoothScroll just restored.
  const { state } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === "POP") return;
    if (!(state as { fromNav?: boolean } | null)?.fromNav) return;
    const hero = document.querySelector<HTMLElement>(".header");
    if (!hero) return;
    const y = hero.offsetTop + hero.offsetHeight;
    // scrollTop sets ScrollSmoother instantly; window.scrollTo would make it
    // glide. Falls back to native scroll under reduced motion (no smoother).
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTop(y);
    else window.scrollTo(0, y);
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
        // numeric stats tick up as they arrive (∞ has no data-count: it just rises)
        document
          .querySelectorAll<HTMLElement>(
            ".profile__stats__item__value[data-count]",
          )
          .forEach((el) => {
            const end = Number(el.dataset.count);
            const suffix = el.dataset.suffix ?? "";
            const proxy = { v: 0 };
            gsap.to(proxy, {
              v: end,
              duration: 1.4,
              ease: "power2.out",
              scrollTrigger: { trigger: ".profile__stats", start: "top 85%" },
              onUpdate: () => {
                el.textContent = `${Math.round(proxy.v)}${suffix}`;
              },
            });
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
        gsap.set(".profile__skills__group__label", { y: 24, autoAlpha: 0 });
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
            ".profile__skills__group__label",
            { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 },
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

        // selected work: each shot wipes up from under its own crop while
        // the copy settles in beside it
        gsap.from(".profile__work .profile__kicker", {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".profile__work", start: "top 85%" },
        });
        gsap.utils
          .toArray<HTMLElement>(".profile__work__item")
          .forEach((item) => {
            const tl = gsap.timeline({
              defaults: { ease: "power3.out" },
              scrollTrigger: { trigger: item, start: "top 78%" },
            });
            // wipe the media box itself. the negative insets keep the clip
            // region larger than the border box by more than the shadow's
            // reach, so the box-shadow is INSIDE the wipe and reveals with the
            // card instead of popping when the clip clears. (cards that seemed
            // to "lose" their shadow were a contrast issue — see the layered
            // box-shadow note in profile.scss — not a rendering bug.)
            // fromTo, not from: from() would tween toward none's equivalent
            // inset(0 0 0 0), and side insets closing in from -60px to 0 would
            // re-clip the shadow at the tail. clearProps removes the clip after.
            // top inset stays in % on BOTH ends: a % start with a px end makes
            // GSAP resolve the 100% against the wrong box (~page height, not
            // the ~380px card), so the wipe travelled thousands of px and the
            // card only uncovered in the last ~6% — an invisible wait then a
            // flick. matching % lets the browser resolve each against the card
            // itself, so the reveal maps linearly across the whole tween.
            // -12% clears the ~20px top shadow reach on both desktop and mobile.
            const media = item.querySelector(".profile__work__item__media");
            tl.fromTo(
              media,
              { clipPath: "inset(100% -60px -60px -60px)" },
              {
                clipPath: "inset(-12% -60px -60px -60px)",
                duration: 1.0,
                ease: "power3.inOut",
                clearProps: "clipPath",
              },
            )
              .from(
                item.querySelectorAll(".profile__work__item__text > *"),
                { y: 30, autoAlpha: 0, duration: 0.6, stagger: 0.09 },
                0.35,
              );
          });
        gsap.from(".profile__work__all", {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".profile__work__all", start: "top 92%" },
        });

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

        // finale: brush strokes paint ink across the viewport, seeked by the
        // scroll position (all-intra encode = instant seeks). frames are
        // alpha-keyed onto a canvas (luma -> alpha): the video's white primer
        // becomes real transparency, so no blend modes are involved — those
        // break on composited <video> and on the scroll-animated paper layer
        const video = document.querySelector<HTMLVideoElement>(
          ".profile__finale__video",
        );
        const canvas = document.querySelector<HTMLCanvasElement>(
          ".profile__finale__canvas",
        );
        const ctx2d = canvas?.getContext("2d");
        const off = document.createElement("canvas");
        // keying buffer resolution — sized once, never per frame (setting
        // canvas.width reallocates + clears). full-res on desktop; halved on
        // mobile, where the per-frame getImageData->alpha loop is the finale's
        // bottleneck and the soft ink hides the lower resolution. 960×540 is a
        // quarter of the pixels the hot loop touches per changed frame.
        const OW = (off.width = isMobile ? 960 : 1920);
        const OH = (off.height = isMobile ? 540 : 1080);
        const offCtx = off.getContext("2d", { willReadFrequently: true });
        const INK = [74, 39, 18]; // the encode's ink color (#4a2712)
        const SRC_FPS = 50; // r_frame_rate of the encode

        // paper tooth: the ink's alpha is modulated by a canvas-grain texture
        // so strokes thin over dark fibers (the page shows through as grain)
        // and stay solid elsewhere. the texture is light with a tight spread
        // (mean ~0.887, dips to 0.55), so we amplify its deviation from the
        // mean rather than stamp it flat — that's what makes the tooth read
        const GRAIN_MEAN = 226; // 0.887 * 255, measured mean luma of the file
        // asymmetric so the grain doesn't read as a shiny surface: light
        // fibers deepen the ink freely, but dark fibers only thin it gently —
        // a hard thin lets the bright page punch through as glinting specks
        const GRAIN_DEEPEN = 3.4; // light fibers -> more opaque ink
        const GRAIN_THIN = 1.6; // dark fibers -> page peeks (kept subtle)
        const grainImg = new Image();
        // mobile skips the paper tooth entirely: grainLuma stays null so the
        // per-pixel hot loop takes its lean branch, and the texture is never
        // even fetched. the tooth is imperceptible at phone size anyway.
        if (!isMobile) grainImg.src = grainTexture;
        let grainLuma: Uint8ClampedArray | null = null;
        // rasterize the texture once at the keying resolution (cover-fit) so
        // its pixels line up 1:1 with the video frame — it never changes
        const buildGrain = () => {
          if (!grainImg.naturalWidth) return;
          const gc = document.createElement("canvas");
          gc.width = OW;
          gc.height = OH;
          const gx = gc.getContext("2d", { willReadFrequently: true });
          if (!gx) return;
          const ps = Math.max(
            OW / grainImg.naturalWidth,
            OH / grainImg.naturalHeight,
          );
          gx.drawImage(
            grainImg,
            (OW - grainImg.naturalWidth * ps) / 2,
            (OH - grainImg.naturalHeight * ps) / 2,
            grainImg.naturalWidth * ps,
            grainImg.naturalHeight * ps,
          );
          grainLuma = gx.getImageData(0, 0, OW, OH).data;
        };

        // the expensive pass: decode luma -> ink alpha over 2M pixels. runs
        // only when the decoded frame actually changes (see render()), not on
        // every scrub seek — the 170%-scroll timeline seeks to hundreds of
        // currentTimes that all resolve to the same one of 54 frames
        const keyFrame = () => {
          offCtx!.drawImage(video!, 0, 0, OW, OH);
          const img = offCtx!.getImageData(0, 0, OW, OH);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            const luma = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
            let a = (255 - luma) * 1.25; // ~81% at full ink -> boost to opaque
            if (a > 255) a = 255;
            // thin the ink over the paper's dark fibers; mean deviation ~0
            // leaves the bulk of the stroke solid, dark specks punch grain
            if (grainLuma) {
              const dev = (grainLuma[i] - GRAIN_MEAN) / 255;
              a *= 1 + (dev < 0 ? GRAIN_THIN : GRAIN_DEEPEN) * dev;
              if (a < 0) a = 0;
              else if (a > 255) a = 255;
            }
            d[i] = INK[0];
            d[i + 1] = INK[1];
            d[i + 2] = INK[2];
            d[i + 3] = a;
          }
          offCtx!.putImageData(img, 0, 0);
        };

        // cheap pass: cover-scale the keyed buffer onto the screen canvas.
        // back it with physical pixels (4K/retina innerWidth is 1×), capped
        // at 2× — beyond that the soft ink edges gain nothing worth the fill.
        // only reallocate on real resize; otherwise clear + redraw the buffer
        const blit = () => {
          // cap the backing store lower on mobile (DPR is often 2–3 there): the
          // soft ink gains nothing from a 3× fill, and the smaller canvas cuts
          // composite + memory cost on the exact devices that struggle
          const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
          const cw = Math.round(window.innerWidth * dpr);
          const ch = Math.round(window.innerHeight * dpr);
          if (canvas!.width !== cw || canvas!.height !== ch) {
            canvas!.width = cw; // realloc clears for us
            canvas!.height = ch;
          } else {
            ctx2d!.clearRect(0, 0, cw, ch); // transparent gaps would stack
          }
          const s = Math.max(cw / OW, ch / OH); // object-fit: cover
          ctx2d!.drawImage(off, (cw - OW * s) / 2, (ch - OH * s) / 2, OW * s, OH * s);
        };

        // paint the currently-decoded frame: re-key only when the frame index
        // moved (resize/repeat just re-blits the cached buffer). called
        // synchronously from `seeked` — at that instant the decoded frame IS
        // the one we asked for; deferring to rAF let currentTime move on first
        let lastFrame = -1;
        const render = () => {
          if (!video || !canvas || !ctx2d || !offCtx || video.readyState < 2) {
            return;
          }
          const frame = Math.round(video.currentTime * SRC_FPS);
          if (frame !== lastFrame) {
            lastFrame = frame;
            keyFrame();
          }
          blit();
        };

        // the scrub sets currentTime up to 60×/s, but a 1080p seek takes
        // longer than a frame — reassigning mid-seek ABANDONS the seek, so
        // `seeked` never lands until the scroll settles and the ink jumps. cap
        // it to one seek in flight: hold the latest target, apply it on land
        let pendingSeek = -1;
        const seekTo = (t: number) => {
          if (!video) return;
          if (video.seeking) pendingSeek = t;
          else video.currentTime = t;
        };
        const onSeeked = () => {
          render(); // draw the frame that just landed
          if (pendingSeek >= 0) {
            const t = pendingSeek;
            pendingSeek = -1;
            video!.currentTime = t; // chase the newest scroll position
          }
        };
        const onLoaded = () => {
          lastFrame = -1; // force a re-key once real video data arrives
          render();
        };
        video?.addEventListener("seeked", onSeeked);
        video?.addEventListener("loadeddata", onLoaded);
        window.addEventListener("resize", render); // frame unchanged: blit only
        const onGrain = () => {
          buildGrain(); // rasterize the tooth, then re-key with it applied
          onLoaded();
        };
        if (!isMobile) {
          grainImg.onload = onGrain;
          if (grainImg.complete && grainImg.naturalWidth) onGrain(); // cached
        }

        // static hosts without Range-request support report the file as
        // unseekable (seekable = [0,0]) and every seek clamps to 0 — a blob:
        // URL is always fully seekable, so route the bytes through one
        let blobUrl: string | undefined;
        if (video) {
          fetch(video.src)
            .then((r) => r.blob())
            .then((b) => {
              blobUrl = URL.createObjectURL(b);
              video.src = blobUrl;
            });
        }
        // the finale pins once the toolkit has fully scrolled away — nothing
        // paints over content the visitor is still reading. from there the
        // scroll drives the whole scene: ink floods the screen, a ghost
        // watermark swells behind, then the type surfaces out of the ink
        const seekProxy = { p: 0 };
        const finaleTl = gsap.timeline({
          scrollTrigger: {
            trigger: ".profile__finale",
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 0.8,
          },
        });
        // the fixed nav rail sits over the ink from the pin onward — flip it.
        // enter/leave-back (not onToggle): everything below the pin start is
        // ink, so only scrolling back above it should unflip
        ScrollTrigger.create({
          trigger: ".profile__finale",
          start: "top top",
          onEnter: () => document.body.classList.add("over-ink"),
          onLeaveBack: () => document.body.classList.remove("over-ink"),
        });
        finaleTl.to(
          seekProxy,
          {
            p: 1,
            ease: "none",
            duration: 0.5,
            onUpdate: () => {
              if (video?.duration) seekTo(seekProxy.p * video.duration);
            },
          },
          0,
        );
        finaleTl.fromTo(
          ".profile__finale__watermark",
          { autoAlpha: 0, scale: 0.88 },
          { autoAlpha: 1, scale: 1, duration: 0.55, ease: "none" },
          0.35,
        );
        finaleTl.fromTo(
          ".profile__finale__content",
          { yPercent: 14 },
          { yPercent: 0, duration: 0.5, ease: "power1.out" },
          0.42,
        );
        finaleTl.fromTo(
          ".profile__finale__kicker",
          { autoAlpha: 0, letterSpacing: "0.7em" },
          {
            autoAlpha: 1,
            letterSpacing: "0.2em",
            duration: 0.28,
            ease: "power2.out",
          },
          0.45,
        );
        // headline: chars climb out of the ink behind masks, tilting upright
        // (words too: chars alone would let lines wrap mid-word)
        SplitText.create(".profile__finale__link", {
          type: "words,chars",
          mask: "chars",
          onSplit: (self) =>
            finaleTl.from(
              self.chars,
              {
                yPercent: 140,
                rotate: 6,
                duration: 0.3,
                stagger: { each: 0.012, from: "start" },
                ease: "power3.out",
              },
              0.52,
            ),
        });
        finaleTl.from(
          ".profile__finale__secondary",
          { y: 26, autoAlpha: 0, duration: 0.15, ease: "power2.out" },
          0.85,
        );
        finaleTl.from(
          ".profile__finale__footer",
          { y: 20, autoAlpha: 0, duration: 0.14, ease: "power2.out" },
          0.86,
        );

        return () => {
          document.body.classList.remove("over-ink");
          video?.removeEventListener("seeked", onSeeked);
          video?.removeEventListener("loadeddata", onLoaded);
          window.removeEventListener("resize", render);
          if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
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
          {
            value: "5+",
            count: 5,
            suffix: "+",
            label: "years building for web & mobile",
          },
          {
            value: "10",
            count: 10,
            label: "projects designed, built & shipped",
          },
          { value: "∞", label: "curiosity for how things work" },
        ].map((stat) => (
          <li className="profile__stats__item" key={stat.label}>
            <span
              className="profile__stats__item__value"
              data-count={stat.count}
              data-suffix={stat.suffix}
            >
              {stat.value}
            </span>
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
        {SKILL_GROUPS.map((group) => (
          <div className="profile__skills__group" key={group.label}>
            <h3 className="profile__skills__group__label">{group.label}</h3>
            <ul className="profile__skills__list">
              {group.skills.map((skill) => (
                <li key={skill.name} className="profile__skills__list__item">
                  <skill.icon size={32} />
                  <span>{skill.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="profile__work">
        <h2 className="profile__kicker">03 — Selected work</h2>
        <ul className="profile__work__list">
          {FEATURED.map((project, i) => (
            <li key={project.slug}>
              <Link
                to={`/projects/${project.slug}`}
                className={`profile__work__item${
                  i % 2 ? " profile__work__item--flip" : ""
                }`}
                viewTransition
              >
                <div
                  className={`profile__work__item__media${
                    project.phone ? " profile__work__item__media--phone" : ""
                  }`}
                >
                  <img
                    src={getProjectImage(project.image)}
                    alt={`Screenshot of ${project.name}`}
                    loading="lazy"
                  />
                </div>
                <div className="profile__work__item__text">
                  <span
                    className="profile__work__item__index"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="profile__work__item__name">{project.name}</h3>
                  <p className="profile__work__item__desc">{project.desc}</p>
                  <span className="profile__work__item__more">
                    View project{" "}
                    <span
                      className="profile__work__item__arrow"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/projects" className="profile__work__all" viewTransition>
          See all projects →
        </Link>
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

      <section className="profile__finale">
        {/* hidden frame source, scrubbed by scroll — frames are drawn onto
            the canvas because blend modes don't apply to composited video */}
        <video
          className="profile__finale__video"
          src="/brush-fill-intra.mp4"
          muted
          playsInline
          preload="none" /* the GSAP setup re-feeds it through a blob URL */
          aria-hidden="true"
          tabIndex={-1}
        />
        <canvas className="profile__finale__canvas" aria-hidden="true" />
        <span className="profile__finale__watermark" aria-hidden="true">
          say hello
        </span>
        <div className="profile__finale__content">
          <p className="profile__finale__kicker">Have a project in mind?</p>
          <Link
            to="/contact"
            className="profile__finale__link"
            viewTransition
            ref={ctaRef}
          >
            Let's build something together{" "}
            <span className="profile__finale__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          <Link to="/projects" className="profile__finale__secondary" viewTransition>
            or see what I've built first
          </Link>
        </div>
        <footer className="profile__finale__footer">
          <span className="profile__finale__footer__note">
            © {new Date().getFullYear()} Tamim Arafat
          </span>
          <ul className="profile__finale__footer__socials">
            {[
              {
                name: "GitHub",
                href: siteMetadata.socialLinks.github,
                icon: <FaGithub />,
              },
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
            ].map((social) => (
              <li key={social.name}>
                <a
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
        </footer>
      </section>
    </div>
  );
}
