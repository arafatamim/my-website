import type { Route } from "./+types/_layout.projects";
import { data, useSearchParams, type MetaFunction } from "react-router";
import { FaTimesCircle } from "react-icons/fa";
import ProjectItem from "~/components/ProjectItem";
import { Masonry } from "react-plock";
import "../styles/projects.scss";
import { getProjectImage } from "../utils/projectImages";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const projects = data?.projects || [];

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
    url: "https://arafatamim.uk/projects",
    name: "Tamim Arafat's Projects",
    description:
      "A non-exhaustive list of projects I have worked on in the past.",
  };

  return [
    {
      title: "Projects — Tamim Arafat",
    },
    {
      name: "description",
      content:
        "A non-exhaustive list of projects I have worked on in the past.",
    },
    {
      "script:ld+json": jsonLd,
    },
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
    tags.every((tag: string) => project.tags.includes(tag)),
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
            d="M0 5 C5 -12, 10 22, 15 5 C22 -18, 30 28, 38 5 C45 -10, 55 20, 65 5 C75 -22, 90 32, 105 5 C118 -15, 135 25, 150 5 C165 -20, 185 30, 205 5 C222 -12, 242 22, 260 5 C278 -18, 300 28, 320 5 C338 -10, 355 20, 375 5 C388 -15, 395 25, 400 5"
            fill="none"
            stroke="var(--accent-2)"
            strokeWidth="2"
            strokeLinecap="round"
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
        className="projects__container"
        items={filteredProjects}
        config={{
          columns: [1, 2, 3, 4],
          gap: [16, 16, 16, 16],
          media: [640, 768, 1920, 2560],
          useBalancedLayout: true,
        }}
        // @ts-expect-error any type
        render={(item, i) => {
          return <ProjectItem key={i} project={item} />;
        }}
      />

      <noscript>
        <div className="projects__container--nojs">
          {filteredProjects.map((project, i) => (
            <ProjectItem key={i} project={project} />
          ))}
        </div>
      </noscript>
    </div>
  );
}
