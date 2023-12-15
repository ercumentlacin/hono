import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const NODE_ENV =
  (import.meta as ImportMeta & { env: { MODE: string } }).env.MODE ??
  "production";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // with options: http://localhost:5173/api/bar-> https://glorious-memory-9qpjjw665g5fwv4-3000.app.github.dev
      "/api": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
