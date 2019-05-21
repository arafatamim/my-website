import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import Projects from "../components/Projects";

export default () => (
  <div>
    <MainLayout location="home">
      <Projects />
    </MainLayout>
  </div>
);
