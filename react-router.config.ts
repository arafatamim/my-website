import type { Config } from "@react-router/dev/config";
import { readFile } from "node:fs/promises";

async function getProjectRoutes() {
  const projectsFile = new URL("./app/content/projects/projects.json", import.meta.url);
  const projects = JSON.parse(await readFile(projectsFile, "utf8")) as Array<{
    slug: string;
  }>;

  return projects.map((project) => `/projects/${project.slug}`);
}

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    return [
      "/profile",
      "/projects",
      "/contact",
      "/robots.txt",
      "/sitemap.xml",
      ...(await getProjectRoutes()),
    ];
  },
  future: {
    v8_viteEnvironmentApi: true,
  },
} satisfies Config;
