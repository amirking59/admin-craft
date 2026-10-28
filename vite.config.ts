import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { paraglideVitePlugin } from "@inlang/paraglide-js";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    // ponytail: SPA mode — auth/locale/theme live in localStorage, so SSR would only render a shell anyway.
    tanstackStart({ spa: { enabled: true } }),
    viteReact(),
    // The language is the one picked in the user menu (stored in localStorage), else English.
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      outputStructure: "message-modules",
      strategy: ["localStorage", "baseLocale"],
    }),
  ],
});
