import React from "react";
import { Link } from "gatsby";
import { Helmet } from "react-helmet";
import "./404.scss";

export default () => (
  <div className="error">
    <Helmet>
      <meta charSet="utf-8" />
      <title>Page not found | Tamim Arafat</title>
    </Helmet>
    <span className="error__subtitle">
      You are lost.{" "}
      <Link to="/" className="error__link">
        Click here to go back.
      </Link>
    </span>
  </div>
);
