import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  type LoaderFunctionArgs,
} from "react-router";
import "animate.css";

import type { Route } from "./+types/root";
import Header from "./components/Header";
import { ClientHintCheck, getHints } from "./utils/clientHints";
import { useTheme } from "./routes/resources.theme-switch";
import { getTheme } from "./utils/theme.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  return {
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request),
      },
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const theme = useTheme();
  const data = useLoaderData<typeof loader>();
  const pathname = location.pathname;

  return (
    <html lang="en" className={theme}>
      <head>
        <ClientHintCheck />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header
          collapsed={
            !["/profile", "/projects", "/contact", "/"].includes(pathname)
          }
          themePreference={data.requestInfo.userPrefs.theme}
        />

        {children}

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  console.error(error);

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>{message}</h1>
      <p>{details}</p>
      <a href="/">&larr; Go back to home</a>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
