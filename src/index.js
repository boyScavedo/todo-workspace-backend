import "dotenv/config";
import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI, { serve } from "swagger-ui-express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";

const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TODO-WORKSPACE API",
      version: "0.0.2",
      description: "This is a simple API for TODO-WORKSPACE",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/models/*.js"],
};

const swaggerSpec = swaggerJSDoc(option);
const app = express();

const allowedOrigins = [
  "http://localhost:5001",
  "https://todo-workspace-backend.onrender.com",
  "https://api.jeevanadhikari.com.np",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/tw/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/tw/v1/users", userRoutes);
app.use("/tw/v1/auth", authRoutes);
app.use("/tw/v1/workspaces", workspaceRoutes);

// TODO: Update the code so that the server starts only after the database is connected
try {
  connectDB();
} catch (error) {
  console.log(error);
} finally {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
