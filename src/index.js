import "dotenv/config";
import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8")
);

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TODO-WORKSPACE API",
      version: pkg.version,
      description: "This is a simple API for TODO-WORKSPACE.",
    },
    servers: [
      {
        url: "https://api.jeevanadhikari.com.np",
        description: "Production server",
      },
      {
        url: "http://localhost:5001",
        description: "Local server",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerOptions = {
  swaggerOptions: {
    supportedSubmitMethods:
      process.env.NODE_ENV === "production"
        ? []
        : ["get", "post", "put", "delete", "patch"],
  },
};

const swaggerSpec = swaggerJSDoc(option);
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5001",
  "https://todo-workspace-backend.onrender.com",
  "https://api.jeevanadhikari.com.np",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isProduction = process.env.NODE_ENV === "production";
    const isAllowed = allowedOrigins.includes(origin);

    if (isAllowed) {
      if (
        isProduction &&
        origin.startsWith("http://") &&
        !origin.includes("localhost")
      ) {
        return callback(
          new Error("Insecure origin not allowed in production"),
          false
        );
      }
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(
  "/tw/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerSpec, swaggerOptions)
);
app.use("/tw/v1/users", userRoutes);
app.use("/tw/v1/auth", authRoutes);
app.use("/tw/v1/workspaces", workspaceRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function startServer() {
  try {
    await connectDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(error, "\n Trying again after 1 minute...");

    setTimeout(() => {
      startServer();
    }, 1 * 60 * 1000);
  }
}

startServer();
