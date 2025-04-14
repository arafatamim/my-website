import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  prerender: ["/profile", "/projects", "/contact"],
  presets: [vercelPreset()],
} satisfies Config;
