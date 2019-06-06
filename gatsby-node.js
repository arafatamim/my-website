const path = require("path");

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const template = path.resolve("src/templates/project.tsx");

  return graphql(`
    query {
      allProjectsJson {
        edges {
          node {
            name
            desc
            logo {
              publicURL
            }
            image {
              publicURL
            }
            meta {
              name
              repo {
                exists
                url
              }
              downloadable
              productLink
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      throw result.errors;
    }

    result.data.allProjectsJson.edges.forEach(post => {
      createPage({
        path: path.join("./projects", post.node.meta.name),
        component: template,
        context: {
          ...post.node,
        },
      });
    });
  });
  // data.forEach(field => {
  //   createPage({
  //     path: path.join("./projects", field.meta.name),
  //     component: template,
  //     context: {
  //       ...field,
  //     },
  //   });
  // });
};
