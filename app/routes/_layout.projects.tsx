import type { Route } from "./+types/_layout.projects";
import { data, type MetaFunction, useSearchParams } from "react-router";
import { FaTimesCircle } from "react-icons/fa";
import ProjectItem from "~/components/ProjectItem";
import { Masonry } from "react-plock";
import "../styles/projects.scss";
import { getProjectImage } from "../utils/projectImages";
import { absoluteUrl, default as siteMetadata } from "../meta";

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
    { name: "twitter:card", content: "summary_large_image" },
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

  return (
    <div className="projects">
      <div className="projects__description-wrapper animate__animated animate__fadeInUp animate__faster">
        <p className="prose projects__description">
          Take a look below at some of my featured work from the past few years.
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
                className="projects__tag-list__tag animate__animated animate__fadeInLeft animate__faster"
              >
                <span className="projects__tag-list__tag__label">{tag}</span>
              </button>
            );
          })}

          <button
            onClick={() => setSearchParams({ tags: [] })}
            className="projects__tag-list__clear animate__animated animate__fadeInRight animate__faster"
            title="Clear all tags"
          >
            <FaTimesCircle />
          </button>
        </div>
      )}

      <Masonry
        key="projects-masonry"
        className="projects__container"
        items={filteredProjects}
        config={{
          columns: [1, 2, 3, 4],
          gap: [16, 16, 16, 16],
          media: [640, 768, 1920, 2560],
        }}
        // @ts-expect-error any type
        render={(item, i) => {
          return <ProjectItem key={item.slug} project={item} />;
        }}
      />

      <noscript>
        <div className="projects__container--nojs">
          {filteredProjects.map((project, i) => (
            <ProjectItem key={project.slug} project={project} />
          ))}
        </div>
      </noscript>
    </div>
  );
}
