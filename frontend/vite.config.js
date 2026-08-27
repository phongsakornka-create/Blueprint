import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // รองรับการเข้าถึงจากมือถือทุกระบบ
    port: 5173,
    allowedHosts: true, // อนุญาตทุกโดเมนและ Tunnel (Cloudflare / Wi-Fi อื่น / เน็ต 4G/5G)
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
