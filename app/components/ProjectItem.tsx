import { NavLink, useSearchParams } from "react-router";
import "./ProjectItem.scss";

interface ProjectItemProps {
  project: {
    slug: string;
    name: string;
    desc: string;
    tags: string[];
    projectImage: string;
  };
  index?: number;
  shape?: "feature" | "tall" | "wide" | "square";
  /** filtered out — dropped from the grid flow, animated by GSAP Flip */
  hidden?: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = (
  { project, index, shape = "square", hidden = false, ...rest },
) => {
  const [searchParams, setSearchParams] = useSearchParams();

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
      <article className="project__card">
        <div className="project__card__image">
          <img src={project.projectImage} alt={`Image for ${project.name}`} />
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
          {project.tags.map((tag: string, i: number) => {
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
