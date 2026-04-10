import { generateRemixSitemap } from "@forge42/seo-tools/remix/sitemap";
import siteMetadata from "./meta";

export const loader = async () => {
  const { routes } = await import("virtual:react-router/server-build");

  const sitemap = await generateRemixSitemap({
    domain: siteMetadata.siteUrl,
    ignore: ["/"],
    routes,
  });

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
};
