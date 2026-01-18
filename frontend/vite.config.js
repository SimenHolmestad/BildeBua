import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/static/react/",
  plugins: [react()],
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5000,
    proxy: {
      "/albums": "http://localhost:5000",
      "/qr_codes": "http://localhost:5000",
    },
  },
});
