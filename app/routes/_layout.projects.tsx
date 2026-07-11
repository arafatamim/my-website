import type { Route } from "./+types/_layout.projects";
import { data, type MetaFunction, useSearchParams } from "react-router";
import { FaTimesCircle } from "react-icons/fa";
import { useRef } from "react";
import ProjectItem from "~/components/ProjectItem";
import "../styles/projects.scss";
import { getProjectImage } from "../utils/projectImages";
import { absoluteUrl, default as siteMetadata } from "../meta";
import {
  gsap,
  isFirstLoad,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "../utils/gsap";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const projects = data?.projects || [];
  const title = "Projects — Tamim Arafat";
  const description =
    "A curated collection of web and mobile applications built by Tamim Arafat, featuring React, Flutter, Go, and more.";
  const url = absoluteUrl("/projects");

  const jsonLd = {
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

  return [
    { title },
    { name: "description", content: description },
    { rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteMetadata.title },
    { property: "og:image", content: absoluteUrl("/og-image.png") },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: absoluteUrl("/og-image.png") },
    { name: "twitter:site", content: "@_arafatamim_" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { "script:ld+json": jsonLd },
  ];
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

  const filteredProjects = projects.filter((project) =>
    tags.every((tag: string) => project.tags.includes(tag))
  );

  const scope = useRef<HTMLDivElement>(null);

  // intro: title chars + description lines + underline (runs once)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(scope.current, { visibility: "visible" });
        // title + underline animate on every visit (they ride the page slide);
        // the rest of the intro only on a cold load
        SplitText.create(".projects__title__text", {
          type: "chars",
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 70,
              autoAlpha: 0,
              filter: "blur(10px)",
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

  // grid: cells rise in as they scroll into view (re-runs when the filter changes)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project__card");
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
    { scope, dependencies: [tags.join(",")], revertOnUpdate: true },
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
        {filteredProjects.map((project, i) => (
          <ProjectItem
            key={project.slug}
            project={project}
            index={i}
            shape={SHAPES[project.slug] ?? "square"}
          />
        ))}
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
