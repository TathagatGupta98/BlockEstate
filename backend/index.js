import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import mongoDb from "./db/mongo.config.js";

// Import routes
import userRoutes from "./routes/user.route.js";
import proposalRoutes from "./routes/proposal.route.js";
import bidRoutes from "./routes/bid.route.js";
import companyRoutes from "./routes/company.route.js";
import voteRoutes from "./routes/vote.route.js";
import companyVoteRoutes from "./routes/companyvote.route.js";

// Import middleware
import { verifyJWT } from "./middlewares/auth.middlewares.js";

import aiRoutes from "./routes/ai.route.js";

const app = express();
const PORT = process.env.PORT || 8000;

// ============= MIDDLEWARE =============
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ============= ROUTES =============

// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/proposals", proposalRoutes);
app.use("/api/v1/bids", bidRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/votes", verifyJWT, voteRoutes);
app.use("/api/v1/company-votes", verifyJWT, companyVoteRoutes);
app.use("/api/v1/ai", aiRoutes);

// ============= ERROR HANDLING =============

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Error:", {
    statusCode,
    message,
    stack: err.stack,
    path: req.path,
  });

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============= DATABASE & SERVER =============

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoDb();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Local: http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

startServer();

export default app;