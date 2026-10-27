import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import coupon from "./api/coupon.js";
import quote from "./api/quote.js";
import office from "./api/office.js";
import catalog from './api/catalog.js';
export default defineConfig({
  plugins: [react(), { name: "local-order-api", configureServer(server) {
    server.middlewares.use("/api/coupon", coupon);
    server.middlewares.use("/api/quote", quote);
    server.middlewares.use("/api/office", office);
    server.middlewares.use('/api/catalog', catalog);
  } }],
  server: { port: 5173, strictPort: true },
});
