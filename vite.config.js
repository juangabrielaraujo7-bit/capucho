import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import coupon from "./api/coupon.js";
import quote from "./api/quote.js";
export default defineConfig({
  plugins: [react(), { name: "local-order-api", configureServer(server) {
    server.middlewares.use("/api/coupon", coupon);
    server.middlewares.use("/api/quote", quote);
  } }],
  server: { port: 5173, strictPort: true },
});
