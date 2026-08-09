import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // When deploying to GitHub Pages under a repository subpath, set `base`
  // to the repo path so generated asset URLs include the correct prefix.
  base: '/ABTALKS2.0/',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    TanStackRouterVite(),
    react(),
  ],
  build: {
    sourcemap: true,
  },
});