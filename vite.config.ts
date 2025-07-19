import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@style": path.resolve(__dirname, "./src/style"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@containers": path.resolve(__dirname, "./src/containers"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@queries": path.resolve(__dirname, "./src/queries"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@mutations": path.resolve(__dirname, "./src/mutations"),
    },
  },
});
