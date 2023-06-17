import express, { NextFunction, Request, Response } from "express";
import AppError from "./utils/appError";

const app = express();

app.use(express.json());

// Any request that makes it to this part has lost it's way
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    status: "failed",
    message: `Can't find ${req.originalUrl} on this server! The resource you're looking for can't be found. Please check the URL before trying again.`,
  });
});

// Global error handling middleware

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "An Internal server error has occured!";
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
