import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/root";
import Header from "./components/Header";
import { ClientHintCheck, getHints, useHints } from "./utils/clientHints";
import "animate.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const clientHints = getHints(request);
  return {
    requestInfo: {
      hints: clientHints,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const clientHints = useHints();
  const pathname = location.pathname;

  return (
    <html lang="en" className={clientHints.theme}>
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
