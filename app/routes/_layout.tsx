import { Outlet } from "react-router";
import { Navigation } from "../components/Navigation";
import "../styles/project.scss";

export default function Layout() {
  return (
    <>
      <Navigation
        navItems={[
          { path: "/profile", label: "Profile" },
          { path: "/projects", label: "Projects" },
          { path: "/contact", label: "Contact" },
        ]}
      />
      <Outlet />
    </>
  );
}
