import React from "react";
import MainLayout from "../components/layouts/MainLayout";
import Projects from "../components/Projects";
import { Helmet } from "react-helmet";
import { graphql as gql } from "gatsby";

export default ({ data }) => (
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
      <Projects data={data.allProjectsJson.edges} />
    </MainLayout>
  </div>
);

export const query = gql`
  query {
    allProjectsJson {
      edges {
        node {
          name
          desc
          image {
            publicURL
          }
          meta {
            name
          }
        }
      }
    }
  }
`;
