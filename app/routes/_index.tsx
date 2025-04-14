import type { Route } from "./+types/_index";
import { redirectDocument } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tamim Arafat — Portfolio" },
    { name: "description", content: "Welcome to Tamim Arafat's portfolio!" },
  ];
}

export function loader() {
  return redirectDocument("/profile", 301);
}
