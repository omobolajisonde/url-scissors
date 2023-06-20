import path from "path";
import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";

import AppError from "./utils/appError";
import authRouter from "./routes/authRoutes";
import scrissorsRouter from "./routes/scissorsRoutes";
import viewsRouter from "./routes/viewRoutes";

const app = express();

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Cookie parser
app.use(cookieParser());

// Initialize passport
app.use(passport.initialize());
require("./middlewares/passport");

// Body parsers middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";
app.use(`${API_BASE_URL}/auth`, authRouter);
app.use(`${API_BASE_URL}/url`, scrissorsRouter);
app.use("/", viewsRouter);

// Any request that makes it to this part has lost it's way
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    status: "failed",
    message: `Can't find ${req.originalUrl} on this server! The resource you're looking for can't be found. Please check the URL before trying again.`,
  });
});

// Global error handling middleware

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "An Internal server error has occured!";
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
