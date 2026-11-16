import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// /api ki requests backend (port 5000) pe proxy ho jayengi
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
