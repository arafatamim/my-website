import { redirect } from "react-router";

// The profile IS the homepage now (served at "/"). Keep the old /profile URL
// alive with a permanent redirect so existing links/bookmarks consolidate
// their authority onto the root.
export function loader() {
  return redirect("/", 301);
}
