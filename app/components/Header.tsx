import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";
import siteMetadata from "../meta";
import avatar from "../assets/img/me.jpg";
import { FaFacebook, FaXTwitter } from "react-icons/fa6";
import "./Header.scss";
import { NavLink } from "react-router";

export default function Header({ collapsed }: { collapsed: boolean }) {
  if (!collapsed) {
    return (
      <div className="header">
        <div className="header__hero">
          <div className="header__hero__main-image">
            <img src={avatar} width={96} height={96} alt={siteMetadata.title} />
          </div>
          <div
            className="header__hero__title"
            style={{ animationDelay: "0.1s" }}
          >
            {siteMetadata.title}
          </div>
          <div
            className="header__hero__subtitle animate__animated animate__fadeInLeft animate__faster"
            style={{ animationDelay: "0.1s" }}
          >
            Web and Mobile Developer
          </div>
          <div
            className="header__hero__main-button animate__animated animate__fadeInLeft animate__faster"
            style={{ animationDelay: "0.2s" }}
          >
            <a
              href={siteMetadata.socialLinks.github}
              className="header__hero__main-button__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
              &nbsp;View GitHub profile
            </a>
          </div>
        </div>
        <hr className="header__divider" />
        <div className="header__actions">
          <ul className="header__actions__socials animate__animated animate__fadeIn animate__faster">
            {[
              {
                name: "LinkedIn",
                href: siteMetadata.socialLinks.linkedIn,
                icon: <FaLinkedin />,
              },
              {
                name: "X (formerly Twitter)",
                href: siteMetadata.socialLinks.x,
                icon: <FaXTwitter />,
              },
              {
                name: "Facebook",
                href: siteMetadata.socialLinks.facebook,
                icon: <FaFacebook />,
              },
            ].map((social) => (
              <li className="header__actions__socials__item" key={social.name}>
                <a
                  className="header__actions__socials__item__link"
                  href={social.href}
                  target="_blank"
                >
                  {social.icon}
                  &nbsp;{social.name}
                </a>
              </li>
            ))}
          </ul>
          {/* <div className="header__actions__theme-selector">
            <ThemeSwitch userPreference={themePreference} />
          </div> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className="collapsed-hero">
        <NavLink to="/" className="collapsed-hero__link" viewTransition>
          <div className="collapsed-hero__header">
            <img
              className="collapsed-hero__header__brand-image"
              src={avatar}
              alt={siteMetadata.title}
              aria-hidden="true"
              height="54px"
              width="54px"
            />
            <span
              className="collapsed-hero__header__site-name"
              style={{ animationDelay: "0.2s" }}
            >
              {siteMetadata.title}
            </span>
          </div>
        </NavLink>
      </div>
    );
  }
}
