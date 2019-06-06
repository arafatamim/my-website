import React from "react";
import "./Projects.scss";
import "animate.css";

const Projects: React.FunctionComponent<{ data: object[] }> = props => {
  const data = props.data;

  return (
    <div className="projects animated fadeInUpBig">
      <div className="projects__header">Projects</div>
      <main>
        <div className="projects__container--grid">
          {data.map((field: any, i: number) => {
            return (
              <a
                href={"/projects/" + field.node.meta.name}
                className="project__link"
                key={i}
              >
                <div className="project__contents">
                  <div className="project__contents__name">
                    {field.node.name}
                  </div>
                  <div className="project__contents__desc">
                    {field.node.desc}
                  </div>
                  {/* <div className="project__contents__image">
                  <img src={field.node.image.publicURL} />
                </div> */}
                </div>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Projects;
