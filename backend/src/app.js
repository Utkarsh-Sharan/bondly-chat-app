import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//Basic config
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//CORS config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//Routes
import authRouter from "./routes/auth.routes.js";
import messageRouter from "./routes/message.routes.js";

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello from test!");
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || "Something went wrong",
    errors: err.errors || null,
    data: err.data || null,
  });
});

export default app;
