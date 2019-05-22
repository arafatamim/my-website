import React from "react";
import "./project.scss";
import Layout from "../components/layouts/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import "animate.css";

export default props => {
  const { name, desc, logo, image, meta } = props.pageContext;
  let tryButton;
  if (meta.downloadable) {
    tryButton = (
      <a
        href={meta.productLink}
        target="_blank"
        rel="noopener noreferrer"
        className="animated fadeIn faster"
      >
        <span>
          <FontAwesomeIcon icon={"download"} /> Download
        </span>
      </a>
    );
  } else {
    tryButton = (
      <a
        href={meta.productLink}
        target="_blank"
        rel="noopener noreferrer"
        className="animated fadeIn fast"
      >
        <span>
          <FontAwesomeIcon icon={"external-link-alt"} /> Try it out
        </span>
      </a>
    );
  }
  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{name} | Tamim Arafat</title>
        <meta name="description" content={`${name}. ${desc}`} />
      </Helmet>
      <div className="project__container">
        <div className="project__logo">
          <img
            src={logo.publicURL}
            alt={name + " logo"}
            width="96"
            height="96"
          />
        </div>
        <div className="project__name animated fadeIn faster">{name}</div>
        <div className="project__desc animated fadeIn faster">{desc}</div>
        <div className="project__buttons animated fadeIn faster">
          {tryButton}
          {meta.repo.exists && (
            <a href={meta.repo.url} target="_blank" rel="noopener noreferrer">
              <span>
                <FontAwesomeIcon icon={["fab", "github"]} /> View source
              </span>
            </a>
          )}
        </div>
        <div className="project__images animated fadeInUpBig fast">
          <img src={image.publicURL} alt={name + " screenshot"} />
        </div>
      </div>
    </Layout>
  );
};
