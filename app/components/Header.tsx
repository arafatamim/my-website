import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";
import siteMetadata from "../meta";
import avatar from "../assets/img/me.jpg";
import "./Header.scss";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";

export default function Header({ collapsed }: { collapsed: boolean }) {
  if (!collapsed) {
    return (
      <div className="header">
        <div className="hero">
          <div className="hero__main-image animate__animated animate__fadeInLeft animate__faster">
            <img src={avatar} width={96} height={96} alt={siteMetadata.title} />
          </div>
          <div
            className="hero__title animate__animated animate__fadeInLeft animate__faster"
            style={{ animationDelay: "0.1s" }}
          >
            {siteMetadata.title}
          </div>
          <div
            className="hero__subtitle animate__animated animate__fadeInLeft animate__faster"
            style={{ animationDelay: "0.1s" }}
          >
            Web and Mobile Developer
          </div>
          <div
            className="hero__main-button animate__animated animate__fadeInLeft animate__faster"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href={siteMetadata.socialLinks.github}
              className="hero__main-button__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
              &nbsp;View GitHub profile
            </a>
          </div>
        </div>
        <div className="actions">
          <ul className="actions__socials">
            <li className="actions__socials__item">
              <a
                className="actions__socials__item__link"
                href={siteMetadata.socialLinks.linkedIn}
                target="_blank"
              >
                <FaLinkedin />
                &nbsp;LinkedIn
              </a>
            </li>
            <li className="actions__socials__item">
              <a
                className="actions__socials__item__link"
                href={siteMetadata.socialLinks.x}
                target="_blank"
              >
                <FaXTwitter />
                &nbsp;X (formerly Twitter)
              </a>
            </li>
            <li className="actions__socials__item">
              <a
                className="actions__socials__item__link"
                href={siteMetadata.socialLinks.facebook}
                target="_blank"
              >
                <FaFacebook />
                &nbsp;Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <div className="collapsed-hero">
        <Link to="/" className="collapsed-hero__link">
          <div className="collapsed-hero__header">
            <img
              className="collapsed-hero__header__brand-image animate__animated animate__fadeInDown animate__faster"
              src={avatar}
              alt={siteMetadata.title}
              aria-hidden="true"
              height="54px"
              width="54px"
            />
            <span
              className="collapsed-hero__header__site-name animate__animated animate__fadeInDown animate__faster"
              style={{ animationDelay: "0.2s" }}
            >
              {siteMetadata.title}
            </span>
          </div>
        </Link>
      </div>
    );
  }
}
