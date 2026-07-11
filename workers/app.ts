import { createRequestHandler, RouterContextProvider } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, _env, _ctx) {
    // v8 requires a RouterContextProvider (plain objects are rejected).
    // Nothing reads the load context — env comes from process.env/import.meta.
    return requestHandler(request, new RouterContextProvider());
  },
} satisfies ExportedHandler<Env>;
