const DEFAULT_SITE_URL = "https://arafatam.im";

const siteUrl = (import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(
  /\/+$/,
  "",
);

const siteMetadata = {
  title: "Tamim Arafat",
  siteUrl,
  socialLinks: {
    github: "//github.com/arafatamim",
    facebook: "//facebook.com/moicesttamim",
    linkedIn: "//linkedin.com/in/arafatamim",
    x: "//x.com/_arafatamim_",
    instagram: "//instagram.com/tam.i.am._",
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteMetadata.siteUrl}/`).toString();
}

export default siteMetadata;
