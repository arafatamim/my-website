import { route, type RouteConfig } from "@react-router/dev/routes";

import { flatRoutes } from "@react-router/fs-routes";

export default [
  ...await flatRoutes(),
  route("robots.txt", "robots.txt.ts"),
  route("sitemap.xml", "sitemap.xml.ts"),
] satisfies RouteConfig;
