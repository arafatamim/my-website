import type { MetaDescriptor } from "react-router";

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

// the single shared OG card. 1200x630 → large-image Twitter card everywhere.
const OG_IMAGE = "/og-image.png";
const TWITTER_HANDLE = "@_arafatamim_";

type MetaInput = {
  title: string;
  description: string;
  /** path for the canonical + og:url, e.g. "/profile" */
  path: string;
  ogType?: "website" | "profile" | "article";
  /** describes the OG image for screen readers / unfurls; defaults to title */
  imageAlt?: string;
  /** structured data appended as a <script type="application/ld+json"> */
  jsonLd?: object | object[];
};

/**
 * Every route was hand-copying the same dozen og:/twitter: tags, and they'd
 * already drifted (two routes shipped a `summary` card despite a 1200x630
 * image). One builder keeps them identical, absolute, and complete.
 */
export function buildMeta(
  { title, description, path, ogType = "website", imageAlt, jsonLd }: MetaInput,
) {
  const url = absoluteUrl(path);
  const image = absoluteUrl(OG_IMAGE);
  const tags: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { rel: "canonical", href: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:site_name", content: siteMetadata.title },
    { property: "og:locale", content: "en_US" },
    { property: "og:image", content: image },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: imageAlt ?? title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
  if (jsonLd) tags.push({ "script:ld+json": jsonLd });
  return tags;
}

export default siteMetadata;
