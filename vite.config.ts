import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    allowedHosts: "7f61-2802-8010-2100-4a00-d442-8299-26c7-78b4.ngrok-free.app",
  },
});
