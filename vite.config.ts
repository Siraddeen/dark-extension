import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "index.html"),
        content: resolve(__dirname, "src/content.ts"),
        background: resolve(__dirname, "src/background.ts"),
      },
      output: {
        entryFileNames: "src/[name].js",
        chunkFileNames: "src/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  publicDir: "public",
  base: "./",
});
