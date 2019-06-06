import React from "react";
import "./MainLayout.scss";
import { useStaticQuery, graphql, Link } from "gatsby";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import "animate.css";

const MainLayout: React.FunctionComponent<{
  location?: String;
  children: any;
}> = props => {
  // Static query
  const data: any = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          socialLinks {
            facebook
            instagram
            github
          }
        }
      }
    }
  `);

  let header: any;
  if (props.location === "home") {
    header = (
      <div className="hero ">
        <div className="hero__main-image animated fadeInLeft fastest">
          <img
            src={require("../../assets/me.png")}
            alt={data.site.siteMetadata.title}
          />
        </div>
        <div
          className="hero__title animated fadeInLeft fastest"
          style={{ animationDelay: "0.1s" }}
        >
          {data.site.siteMetadata.title}
        </div>
        <div
          className="hero__subtitle animated fadeInLeft fastest"
          style={{ animationDelay: "0.1s" }}
        >
          Student and enthusiastic coder
        </div>
        <div
          className="hero__main-button animated fadeInLeft fastest"
          style={{ animationDelay: "0.2s" }}
        >
          <a
            href={data.site.siteMetadata.socialLinks.github}
            className="hero__main-button__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={["fab", "github"]} />
            &nbsp;View GitHub repos
          </a>
        </div>
      </div>
    );
  } else {
    header = (
      <div className="nav">
        <Link to="/" className="nav__link">
          <div className="nav__header">
            <img
              className="nav__header__brand-image animated fadeInDown faster"
              src={require("../../assets/me.png")}
              alt={data.site.siteMetadata.title}
              aria-hidden="true"
              height="35px"
              width="35px"
            />
            <span
              className="nav__header__site-name animated fadeInDown faster"
              style={{ animationDelay: "0.2s" }}
            >
              {data.site.siteMetadata.title}
            </span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <html lang="en" />
      </Helmet>
      <header>{header}</header>
      {props.children}
      <footer>
        <div className="footer">
          <div className="footer__content">
            <div className="footer__content__left">
              &copy; {data.site.siteMetadata.title} {new Date().getFullYear()}
            </div>
            <div className="footer__content__right">
              <a
                href={data.site.siteMetadata.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__content__right__link"
                aria-label="Facebook social link"
              >
                <FontAwesomeIcon icon={["fab", "facebook"]} />
              </a>
              <a
                href={data.site.siteMetadata.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__content__right__link"
                aria-label="Instagram social link"
              >
                <FontAwesomeIcon icon={["fab", "instagram"]} />
              </a>

              <a
                href={data.site.siteMetadata.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__content__right__link"
                aria-label="GitHub social link"
              >
                <FontAwesomeIcon icon={["fab", "github"]} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
