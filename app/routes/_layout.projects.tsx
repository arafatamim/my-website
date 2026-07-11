import type { Route } from "./+types/_layout.projects";
import { data, useSearchParams } from "react-router";
import { FaTimesCircle } from "react-icons/fa";
import { useRef } from "react";
import ProjectItem from "~/components/ProjectItem";
import "../styles/projects.scss";
import { getProjectImage } from "../utils/projectImages";
import { absoluteUrl, buildMeta } from "../meta";
import {
  Flip,
  gsap,
  isFirstLoad,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "../utils/gsap";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  const projects = loaderData?.projects || [];
  const title = "Projects — Tamim Arafat";
  const description =
    "A curated collection of web and mobile applications built by Tamim Arafat, featuring React, Flutter, Go, and more.";
  const url = absoluteUrl("/projects");

  const jsonLd: object = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project: any, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CreativeWork",
        name: project.name,
        description: project.desc,
        keywords: project.tags.join(", "),
        author: {
          "@type": "Person",
          name: "Tamim Arafat",
        },
      },
    })),
    numberOfItems: projects.length,
    url,
    name: "Tamim Arafat's Projects",
    description,
  };

  return buildMeta({ title, description, path: "/projects", jsonLd });
};

export async function loader() {
  const projects = (await import("../content/projects/projects.json"))[
    "default"
  ];

  const enhancedProjects = projects.map((project) => {
    const projectWithImages = {
      ...project,
      projectImage: getProjectImage(project.image),
    };

    return projectWithImages;
  });

  return data({ projects: enhancedProjects });
}

export default function ProjectsTab({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  const tags = searchParams.getAll("tags");
  const tagKey = tags.join(",");

  const scope = useRef<HTMLDivElement>(null);

  // FLIP capture: read the cards' current geometry BEFORE React commits the new
  // filter. Render still shows the previously-committed layout, so this is the
  // "First" snapshot; the effect below plays it to the "Last" after commit.
  // (A deliberate render-phase read — the one place FLIP has to reach the DOM.)
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const prevTagKey = useRef(tagKey);
  if (prevTagKey.current !== tagKey && scope.current) {
    flipState.current = Flip.getState(
      scope.current.querySelectorAll(".project__link"),
    );
  }
  prevTagKey.current = tagKey;

  // intro: title chars + description lines + underline (runs once)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(scope.current, { visibility: "visible" });
        // blur is the priciest filter to animate; skip per-char blur on mobile
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        // title + underline animate on every visit (they ride the page slide);
        // the rest of the intro only on a cold load
        SplitText.create(".projects__title__text", {
          type: "chars",
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 70,
              autoAlpha: 0,
              filter: isMobile ? "none" : "blur(10px)",
              duration: 1,
              stagger: 0.035,
              ease: "power3.out",
              delay: 0.1,
            }),
        });
        gsap.fromTo(
          ".projects__underline path",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            delay: 0.5,
            ease: "power2.out",
            autoRound: false, // sub-pixel draw (pathLength=1)
          },
        );
        if (isFirstLoad()) {
          SplitText.create(".projects__description", {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.8,
                stagger: 0.07,
                delay: 0.3,
                ease: "power3.out",
                onComplete: () => self.revert(), // hand DOM back to React
              }),
          });
        }
      });
    },
    { scope },
  );

  // grid: cells rise in as they scroll into view. Runs once on mount only —
  // filter changes are owned by the Flip transition below, not a replayed intro.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project__link");
        if (!cards.length) return;
        gsap.set(cards, { y: 36, scale: 0.96, autoAlpha: 0 });
        ScrollTrigger.batch(cards, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
              // leave no inline styles behind: cards morph via view transitions
              clearProps: "transform,opacity,visibility",
            }),
        });
      });
    },
    { scope },
  );

  // filter: FLIP the grid from its pre-change layout — survivors glide to their
  // new bento slots while entering/leaving cards fade + scale. Reduced motion
  // skips straight to the committed layout (React already toggled display).
  useGSAP(
    () => {
      const state = flipState.current;
      flipState.current = null;
      if (!state) return; // first mount, or nothing captured
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // a card parked at the intro's pre-reveal opacity (scrolled past, never
      // revealed) must show once it's part of an active filter transition.
      gsap.set(
        scope.current!.querySelectorAll(".project__link:not(.project__link--hidden)"),
        { autoAlpha: 1 },
      );

      Flip.from(state, {
        duration: 0.55,
        ease: "power2.inOut",
        // only leaving cards go position:absolute (to fade out without holding
        // grid space). `absolute: true` would take ALL cards out of flow,
        // collapsing the grid to ~0 height mid-animation — which clamps the
        // window scroll to the top. Survivors/entering stay in flow, so the
        // grid keeps its height and the scroll position holds.
        absoluteOnLeave: true,
        scale: true,
        stagger: 0.03,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { autoAlpha: 0, scale: 0.8 },
            { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power2.out" },
          ),
        onLeave: (els) =>
          gsap.to(els, {
            autoAlpha: 0,
            scale: 0.8,
            duration: 0.35,
            ease: "power2.in",
          }),
      });
    },
    { scope, dependencies: [tagKey] },
  );

  return (
    <div className="projects" ref={scope}>
      <header className="projects__intro">
        <h1 className="projects__title">
          <span className="projects__title__text">Selected Work</span>
        </h1>
        <div className="projects__description-wrapper">
          <p className="prose projects__description">
            Take a look below at some of my featured work from the past few
            years.
          </p>
          <svg
            className="projects__underline"
            viewBox="0 -25 400 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 5 C5 -20, 10 18, 15 5 C22 -10, 30 32, 38 5 C45 -25, 55 15, 65 5 C75 -15, 90 28, 105 5 C118 -22, 135 20, 150 5 C165 -28, 185 25, 205 5 C222 -12, 242 30, 260 5 C278 -20, 300 22, 320 5 C338 -28, 355 18, 375 5 C388 -22, 395 28, 400 5"
              fill="none"
              stroke="var(--accent-2)"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
            />
          </svg>
        </div>

        {tags.length > 0 && (
          <div className="projects__tag-list ">
            {tags.map((tag) => {
              return (
                <button
                  key={tag}
                  onClick={() => {
                    const newTags = tags.filter((t: string) => t !== tag);
                    setSearchParams({ tags: newTags });
                  }}
                  className="projects__tag-list__tag"
                >
                  <span className="projects__tag-list__tag__label">{tag}</span>
                </button>
              );
            })}

            <button
              onClick={() => setSearchParams({ tags: [] })}
              className="projects__tag-list__clear"
              title="Clear all tags"
            >
              <FaTimesCircle />
            </button>
          </div>
        )}
      </header>

      <div className="projects__grid">
        {(() => {
          // render every card (stable key) so Flip can animate the diff; the
          // filter just hides non-matches. index counts visible cards only.
          let visible = 0;
          return projects.map((project) => {
            const matches = tags.every((tag: string) =>
              project.tags.includes(tag)
            );
            return (
              <ProjectItem
                key={project.slug}
                project={project}
                index={matches ? visible++ : undefined}
                hidden={!matches}
                shape={SHAPES[project.slug] ?? "square"}
              />
            );
          });
        })()}
      </div>
    </div>
  );
}

// bento spans picked from each screenshot's natural aspect ratio
const SHAPES: Record<string, "feature" | "tall" | "wide" | "square"> = {
  ferngeist: "feature", // ~1:1, newest — gets the 2×2 cell
  "amar-rapid-pass": "tall",
  "freight-away": "tall",
  "goodlink-global": "tall",
  "rbds-website": "tall",
  "flutter-movies": "wide",
  multistreamer: "wide",
  // mym is 1.76 but its hero is centered, so the square crop reads fine —
  // and it makes the default grid a clean 5×4 rectangle (20 cell units)
  "mym-website": "square",
  "waqt-web": "wide",
  "tally-counter-pwa": "square",
};
