import type { Route } from "./+types/_layout.projects";
import { useSearchParams } from "react-router";
import { FaTimesCircle } from "react-icons/fa";
import ProjectItem from "~/components/ProjectItem";
// @ts-expect-error
import { Masonry } from "react-plock/dist/index.es.js";
import "../styles/projects.scss";
import { getProjectImage } from "../utils/projectImages";

export function meta() {
  return [
    {
      title: "Projects — Tamim Arafat",
    },
  ];
}

export async function loader() {
  const projects = (await import("../content/projects/projects.json"))[
    "default"
  ];

  const enhancedProjects = projects.map((project: any) => {
    const projectWithImages = { ...project };

    projectWithImages.projectImage = getProjectImage(project.image);

    return projectWithImages;
  });

  return {
    projects: enhancedProjects,
  };
}

export default function ProjectsTab({ loaderData }: Route.ComponentProps) {
  const { projects } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  const tags = searchParams.getAll("tags");

  const filteredProjects = projects.filter((project: any) =>
    tags.every((tag: string) => project.tags.includes(tag))
  );

  return (
    <div className="projects">
      <p className="prose projects__description animate__animated animate__fadeInUp animate__faster">
        A non-exhaustive list of projects I have worked on in the past.
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
        className="projects__container animate__animated animate__fadeInUp animate__faster"
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
    </div>
  );
}
