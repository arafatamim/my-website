import { Link, useSearchParams, NavLink } from "react-router";
// import "animate.css";
import "./ProjectItem.scss";

interface ProjectItemProps {
  project: {
    slug: string;
    name: string;
    desc: string;
    tags: string[];
    projectImage: string;
  };
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, ...rest }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <NavLink
      {...rest}
      to={"/projects/" + project.slug}
      className="project__link"
      viewTransition
    >
      <div className="project__card animate__animated animate__fadeInUp animate__faster">
        <div className="project__card__name">{project.name}</div>
        <p className="project__card__desc">{project.desc}</p>
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
        <div className="project__card__image">
          <img src={project.projectImage} alt={`Image for ${project.name}`} />
        </div>
      </div>
    </NavLink>
  );
};

export default ProjectItem;
