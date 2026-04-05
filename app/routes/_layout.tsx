import { Outlet } from "react-router";
import { Navigation } from "../components/Navigation";
import "../styles/project.scss";

export default function Layout() {
  return (
    <>
      <Navigation
        navItems={[
          { path: "/profile", label: "PROFILE" },
          { path: "/projects", label: "PROJECTS" },
          { path: "/contact", label: "CONTACT" },
        ]}
      />
      <Outlet />
    </>
  );
}
