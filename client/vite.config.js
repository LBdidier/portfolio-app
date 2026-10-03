import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
const r = (p) => fileURLToPath(new URL(p, import.meta.url));
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:3001" } },
  build: { rollupOptions: { input: { main: r("./index.html"), admin: r("./admin.html") } } },
});
