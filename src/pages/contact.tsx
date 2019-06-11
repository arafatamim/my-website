import React from "react";
import { Helmet } from "react-helmet";
import MainLayout from "../components/layouts/MainLayout";
import "./contact.scss";

const Count: React.FunctionComponent = () => (
  <MainLayout>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Contact | Tamim Arafat</title>
    </Helmet>
    <div className="contact__header">Drop me a line</div>
    <div className="contact__form" />
    <span>Under Construction</span>
  </MainLayout>
);

export default Count;
