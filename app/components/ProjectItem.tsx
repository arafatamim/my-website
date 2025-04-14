import React from "react";
import { Link, useSearchParams } from "react-router";
import "animate.css";
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
    <Link {...rest} to={"/projects/" + project.slug} className="project__link">
      <div className="project__contents">
        <div className="project__contents__name">{project.name}</div>
        <p className="project__contents__desc">{project.desc}</p>
        <div className="project__contents__tags">
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
                className="project__contents__tags__tag"
              >
                {tag}
              </button>
            );
          })}
        </div>
        <div className="project__contents__image">
          <img src={project.projectImage} alt={`Image for ${project.name}`} />
        </div>
      </div>
    </Link>
  );
};

export default ProjectItem;
