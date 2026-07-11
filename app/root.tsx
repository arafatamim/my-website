import {
  isRouteErrorResponse,
  Links,
  type LoaderFunctionArgs,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import type { Route } from "./+types/root";
import { endFirstLoad } from "./utils/gsap";
import Header from "./components/Header";
import SmoothScroll from "./components/SmoothScroll";
import { getHints, useHintsSafe } from "./utils/clientHints";
import { normalizePathname } from "./utils/path";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap",
  },
  {
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap",
  },
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
  { rel: "manifest", href: "/site.webmanifest" },
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
  const clientHints = useHintsSafe();
  const pathname = normalizePathname(location.pathname);

  useEffect(endFirstLoad, []);

  return (
    // suppressHydrationWarning: the inline script below adds .js pre-paint
    <html
      lang="en"
      className={clientHints?.theme ?? "light"}
      suppressHydrationWarning
    >
      <head>
        {/*
          Pre-paint, before hydration: mark JS availability (so CSS can defer to
          GSAP) and set the theme from the live system preference. This must be
          script-driven, not server-driven: most routes are prerendered to static
          HTML with no request cookie, so a server-set theme class is frozen at
          build time. matchMedia reads the real preference on every page and the
          change listener keeps it live. React never rewrites html.className (its
          value is a constant), so these classes persist.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js");` +
              `try{var m=matchMedia("(prefers-color-scheme: dark)");` +
              `var t=function(){document.documentElement.classList.toggle("dark",m.matches)};` +
              `t();m.addEventListener("change",t)}catch(e){}`,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1a1a2e" />
        <Meta />
        <Links />
      </head>
      <body>
        <svg style={{ display: "none" }} aria-hidden="true">
          <defs>
            <filter id="text-displacement">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves="4"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <filter
              id="brush-stroke"
              x="-10%"
              y="-20%"
              width="120%"
              height="140%"
            >
              {/*
                static noise, not animated: an <animate> on baseFrequency forces
                the whole feTurbulence + feDisplacementMap + feGaussianBlur chain
                to recompute every frame, forever, on every element wearing this
                filter (all nav dashes + the ink divider). The shimmer it bought
                is imperceptible on a 3px dash and murderous on mobile. The
                displacement still gives the brushy edge — just at zero idle cost.
              */}
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.03 0.06"
                numOctaves="3"
                seed="5"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="5"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feGaussianBlur
                in="displaced"
                stdDeviation="0.4"
                result="blurred"
              />
              <feMerge>
                <feMergeNode in="blurred" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* full-viewport hero only on the home story; compact brand elsewhere */}
        <Header collapsed={!["/profile", "/"].includes(pathname)} />

        {children}

        <SmoothScroll />
        <ScrollRestoration />
        <Scripts />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
        />
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
    details = error.status === 404
      ? "The requested page could not be found."
      : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
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
