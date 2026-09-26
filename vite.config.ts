import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const repository = "perry-s-balloons-decor";

export default defineConfig({
  base: process.env["GITHUB_ACTIONS"] ? `/${repository}/` : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
});
