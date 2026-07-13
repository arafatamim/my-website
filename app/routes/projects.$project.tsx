import type { Route } from "./+types/projects.$project";
import type { SitemapHandle } from "@forge42/seo-tools/remix/sitemap";
import "../styles/project.scss";
import { FaArrowLeftLong, FaDownload, FaGitAlt, FaPlay } from "react-icons/fa6";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  getLogoImage,
  getProjectImage,
  projectVideos,
} from "~/utils/projectImages";
import { useRef } from "react";
import { Link } from "react-router";

import { absoluteUrl, buildMeta } from "../meta";
import { gsap, useGSAP } from "../utils/gsap";
import { useMagneticAll } from "../utils/useMagnetic";

export const handle: SitemapHandle<unknown> = {
  sitemap: async (domain) => {
    const projects =
      (await import("../content/projects/projects.json")).default;

    return projects.map((project) => ({
      route: `${domain}/projects/${project.slug}`,
      changefreq: "monthly" as const,
      priority: 0.7 as const,
    }));
  },
};

export async function loader({ params }: Route.LoaderArgs) {
  const projectId = params.project;

  const projects = (await import("../content/projects/projects.json"))[
    "default"
  ];
  const project = projects.find((p) => p.slug === projectId);

  if (!project) {
    throw new Response("Not found", { status: 404 });
  }

  let logoImage: string | null = null;

  if (project.logo) {
    logoImage = getLogoImage(project.logo);
  }

  const projectImage = getProjectImage(project.image);
  const projectVideo = project.video ? projectVideos[project.video] : null;

  return { project, logoImage, projectImage, projectVideo };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const project = loaderData?.project;
  if (!project) return [];

  const title = `${project.name} — Tamim Arafat`;
  const url = absoluteUrl(`/projects/${project.slug}`);

  return buildMeta({
    title,
    description: project.desc,
    path: `/projects/${project.slug}`,
    ogType: "article",
    imageAlt: `${project.name} — project by Tamim Arafat`,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.name,
        description: project.desc,
        keywords: project.tags.join(", "),
        url,
        author: {
          "@type": "Person",
          name: "Tamim Arafat",
          url: absoluteUrl("/"),
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Projects",
            item: absoluteUrl("/projects"),
          },
          { "@type": "ListItem", position: 2, name: project.name, item: url },
        ],
      },
    ],
  });
}

export default function Project({ loaderData }: Route.ComponentProps) {
  const {
    project: { name, desc, repo, productLink, downloadLink, demoLink, tags },
    logoImage,
    projectImage,
    projectVideo,
  } = loaderData;

  const tryButton = productLink != null
    ? (
      <a href={productLink} target="_blank" rel="noopener noreferrer">
        <FaExternalLinkAlt />
        Visit project
      </a>
    )
    : demoLink != null
    ? (
      <a href={demoLink} target="_blank" rel="noopener noreferrer">
        <FaPlay />
        View demo
      </a>
    )
    : downloadLink != null
    ? (
      <a href={downloadLink} target="_blank" rel="noopener noreferrer">
        <FaDownload />
        Download
      </a>
    )
    : null;

  const scope = useRef<HTMLDivElement>(null);
  useMagneticAll(scope, ".project__buttons a", 0.2, [name]);

  // name/tags/image morph in via the native view transition and must not be
  // touched by GSAP; everything else gets the ink entrance
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".project__back", {
          x: -14,
          autoAlpha: 0,
          duration: 0.6,
          delay: 0.2,
          ease: "power3.out",
        });
        if (scope.current?.querySelector(".project__logo")) {
          gsap.fromTo(
            ".project__logo",
            { rotateX: -75, autoAlpha: 0, transformPerspective: 500 },
            {
              rotateX: 0,
              autoAlpha: 1,
              duration: 0.8,
              delay: 0.15,
              ease: "power3.out",
              clearProps: "all",
            },
          );
        }
        gsap.fromTo(
          ".project__desc",
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            delay: 0.25,
            ease: "power3.out",
            // no clearProps: it strips the inline visibility autoAlpha set,
            // dropping the element back to the CSS pre-hydration `hidden`
          },
        );
        gsap.fromTo(
          ".project__underline path",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            delay: 0.5,
            ease: "power2.out",
            autoRound: false, // sub-pixel draw (pathLength=1)
          },
        );
        gsap.fromTo(
          ".project__buttons",
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            delay: 0.4,
            ease: "power3.out",
            // see .project__desc: clearProps would re-hide it post-tween
          },
        );
        // screenshot drifts gently against the scroll (progress 0 on load,
        // so the view-transition morph onto the image is untouched)
        gsap.to(".project__images", {
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: ".project__images",
            start: "top 80%",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope, dependencies: [name], revertOnUpdate: true },
  );

  return (
    <div className="project" ref={scope}>
      <Link to="/projects" className="project__back" viewTransition>
        <FaArrowLeftLong aria-hidden="true" /> All projects
      </Link>

      <header className="project__intro">
        {logoImage && (
          <div className="project__logo">
            <img src={logoImage} alt={name + " logo"} height="80" />
          </div>
        )}
        <h1 className="project__name">{name}</h1>
        <p className="project__desc">{desc}</p>
        <svg
          className="project__underline"
          viewBox="0 -25 400 60"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 5 C5 -14, 10 24, 15 5 C22 -20, 30 26, 38 5 C45 -12, 55 22, 65 5 C75 -24, 90 30, 105 5 C118 -16, 135 24, 150 5 C165 -22, 185 28, 205 5 C222 -14, 242 24, 260 5 C278 -20, 300 26, 320 5 C338 -12, 355 22, 375 5 C388 -16, 395 26, 400 5"
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength="1"
          />
        </svg>
      </header>

      <div className="project__meta">
        <div className="project__tags">
          {tags.map((tag) => (
            <a
              key={tag}
              href={`/projects?tags=${tag}`}
              className="project__tags__tag"
            >
              {tag}
            </a>
          ))}
        </div>
        <div className="project__buttons">
          {tryButton}
          {repo?.url && (
            <a
              href={repo.url as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGitAlt /> View source
            </a>
          )}
        </div>
      </div>

      <figure className="project__images">
        {projectVideo
          ? (
            <video
              src={projectVideo}
              poster={projectImage}
              autoPlay
              muted
              loop
              playsInline
              aria-label={name + " demo"}
            />
          )
          : <img src={projectImage} alt={name + " screenshot"} />}
      </figure>
    </div>
  );
}
