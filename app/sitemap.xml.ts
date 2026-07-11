import { generateRemixSitemap } from "@forge42/seo-tools/remix/sitemap";
import siteMetadata from "./meta";

export const loader = async () => {
  const { routes } = await import("virtual:react-router/server-build");

  const sitemap = await generateRemixSitemap({
    domain: siteMetadata.siteUrl,
    ignore: ["/profile"],
    routes,
  });

  // the pathless `_layout` route and its `_layout._index` child both resolve
  // to "/", so the generator emits it twice — drop duplicate <url> blocks.
  const seen = new Set<string>();
  const deduped = sitemap.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
    const loc = block.match(/<loc>([^<]*)<\/loc>/)?.[1];
    if (!loc || seen.has(loc)) return "";
    seen.add(loc);
    return block;
  });

  return new Response(deduped, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
    },
  });
};
