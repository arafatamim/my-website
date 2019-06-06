module.exports = {
  siteMetadata: {
    title: "Tamim Arafat",
    socialLinks: {
      facebook: "//facebook.com/arafatamim",
      instagram: "//instagram.com/arafatamim",
      github: "//github.com/arafatamim",
    },
  },
  plugins: [
    `gatsby-plugin-typescript`,
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "src", path: `${__dirname}/src` },
    },
    "gatsby-transformer-json",
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-offline",
  ],
};
