import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

// Import API handlers
import authHandler from "./api/auth";
import sessionsHandler from "./api/sessions";
import sessionsIdHandler from "./api/sessions/[id]";
import goalsHandler from "./api/goals";
import goalsIdHandler from "./api/goals/[id]";
import statsHandler from "./api/stats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON request body parser
  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mount API endpoints
  app.all("/api/auth", (req, res) => {
    authHandler(req, res).catch((err) => {
      console.error("Error in auth handler:", err);
      res.status(500).json({ error: err.message });
    });
  });

  app.all("/api/sessions", (req, res) => {
    sessionsHandler(req, res).catch((err) => {
      console.error("Error in sessions handler:", err);
      res.status(500).json({ error: err.message });
    });
  });

  // Express matches :id, which maps back to req.params.id
  app.all("/api/sessions/:id", (req, res) => {
    sessionsIdHandler(req, res).catch((err) => {
      console.error("Error in sessions ID handler:", err);
      res.status(500).json({ error: err.message });
    });
  });

  app.all("/api/goals", (req, res) => {
    goalsHandler(req, res).catch((err) => {
      console.error("Error in goals handler:", err);
      res.status(500).json({ error: err.message });
    });
  });

  app.all("/api/goals/:id", (req, res) => {
    goalsIdHandler(req, res).catch((err) => {
      console.error("Error in goals ID handler:", err);
      res.status(500).json({ error: err.message });
    });
  });

  app.all("/api/stats", (req, res) => {
    statsHandler(req, res).catch((err) => {
      console.error("Error in stats handler:", err);
      res.status(500).json({ error: err.message });
    });
  });

  // Setup static serving or Vite middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Reyes Training Log] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server bootstrap failure:", error);
});
