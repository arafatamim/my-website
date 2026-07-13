import { NavLink, useSearchParams } from "react-router";
import { useState } from "react";
import type { ProjectWithMedia } from "~/utils/projectImages";
import "./ProjectItem.scss";

interface ProjectItemProps {
  project: ProjectWithMedia;
  index?: number;
  shape?: "feature" | "tall" | "wide" | "square";
  /** filtered out — dropped from the grid flow, animated by GSAP Flip */
  hidden?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = (
  { project, index, shape = "square", hidden = false, ...rest },
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hovered, setHovered] = useState(false);
  const showVideo = hovered && project.projectVideo != null;

  return (
    <NavLink
      {...rest}
      to={"/projects/" + project.slug}
      className={`project__link project__link--${shape}${
        hidden ? " project__link--hidden" : ""
      }`}
      viewTransition
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      <article
        className="project__card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="project__card__image">
          {showVideo
            ? (
              <video
                src={project.projectVideo}
                poster={project.projectImage}
                autoPlay
                muted
                loop
                playsInline
                style={project.imagePosition
                  ? { objectPosition: project.imagePosition }
                  : undefined}
                aria-label={`Demo for ${project.name}`}
              />
            )
            : (
              <img
                src={project.projectImage}
                alt={`Image for ${project.name}`}
                style={project.imagePosition
                  ? { objectPosition: project.imagePosition }
                  : undefined}
              />
            )}
        </div>
        <div className="project__card__label">
          {index != null && (
            <span className="project__card__index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          <span className="project__card__name">{project.name}</span>
        </div>
        <div className="project__card__tags">
          {project.tags.slice(0, 3).map((tag: string, i: number) => {
            return (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const tags = searchParams.getAll("tags");
                  if (!tags.includes(tag)) {
                    tags.push(tag);
                    setSearchParams({ tags }, { preventScrollReset: true });
                  }
                }}
                key={i}
                className="project__card__tags__tag"
              >
                {tag}
              </button>
            );
          })}
        </div>
      </article>
    </NavLink>
  );
};

export default ProjectItem;
