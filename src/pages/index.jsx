import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import Projects from "../components/Projects";
import { Helmet } from "react-helmet";

export default () => (
  <div>
    <Helmet>
      <meta charSet="utf-8" />
      <meta
        name="description"
        content="Tamim Arafat, student and enthusiastic coder."
      />
      <title>Tamim Arafat</title>
    </Helmet>
    <MainLayout location="home">
      <Projects />
    </MainLayout>
  </div>
);
