import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import caktoWebhookHandler from "./api/webhook/cakto.js";
import testWebhookHandler from "./api/webhook/test.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mount the Cakto webhook handler
  app.post("/api/webhook/cakto", async (req, res) => {
    // The handler expects req and res
    await caktoWebhookHandler(req, res);
  });

  // Mount the Test webhook handler
  app.all("/api/test-webhook", async (req, res) => {
    await testWebhookHandler(req, res);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
