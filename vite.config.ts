import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    ...(process.env.ALLOWED_HOSTS
      ? { allowedHosts: process.env.ALLOWED_HOSTS.split(",") }
      : {}),
  },
});
