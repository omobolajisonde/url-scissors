import path from "path";
import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/authRoutes";
import scrissorsRouter from "./routes/scissorsRoutes";
import viewsRouter from "./routes/viewRoutes";
import { redirectToOriginalURL } from "./controllers/scissorsController";
import globalErrorHandler from "./controllers/errorControllers";

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

// Middleware for rate limiting
const appLimiter = rateLimit({
  max: 100, // max allowable number of request from an IP address in a given timeframe
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too many requests from your IP address, please try again later.",
});
app.use("/", appLimiter); // Use to limit repeated requests to the server

const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";
console.log(API_BASE_URL, "🎯🎯", process.env.API_BASE_URL);
app.use("/", viewsRouter);
app.get("/s/:urlAlias", redirectToOriginalURL);

app.use(`${API_BASE_URL}/auth/`, authRouter);
app.use(`${API_BASE_URL}/url/`, scrissorsRouter);

// Any request that makes it to this part has lost it's way
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).render("error", {
    hideNav: true,
    message: `Can't find ${req.originalUrl} on this server! The resource you're looking for can't be found. Please check the URL before trying again.`,
  });
});

// Global error handling middleware

app.use(globalErrorHandler);

export default app;
