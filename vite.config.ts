import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  // ponytail: SPA mode — auth/locale/theme live in localStorage, so SSR would only render a shell anyway.
  plugins: [tailwindcss(), tanstackStart({ spa: { enabled: true } }), viteReact()],
});
