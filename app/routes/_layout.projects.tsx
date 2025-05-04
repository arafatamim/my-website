import type { Route } from "./+types/_layout.projects";
import { data, useSearchParams, type MetaFunction } from "react-router";
import { FaTimesCircle } from "react-icons/fa";
import ProjectItem from "~/components/ProjectItem";
// @ts-expect-error
import { Masonry } from "react-plock/dist/index.es.js";
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
      <p className="prose projects__description animate__animated animate__fadeInUp animate__faster">
        Take a look below at some of my featured work from the past few years.
      </p>

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
        // @ts-expect-error
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
