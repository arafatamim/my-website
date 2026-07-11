import { Outlet } from "react-router";
import "../styles/project.scss";

// The fixed nav rail now renders in root.tsx, outside ScrollSmoother's
// transformed #smooth-content (a transform would otherwise trap the fixed
// element in a new containing block). This layout just nests the routes.
export default function Layout() {
  return <Outlet />;
}
