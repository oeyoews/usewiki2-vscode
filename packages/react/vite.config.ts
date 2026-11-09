import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "src"),
      "@/components": path.resolve(rootDir, "src/components"),
    },
  },
  build: {
    outDir: "../../react-dist",
    assetsDir: ".",
    rollupOptions: {
      output: {
        entryFileNames: "main.js",
        assetFileNames: "main.[ext]",
      },
    },
  },
});
