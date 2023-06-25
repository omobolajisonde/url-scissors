import AppError from "../utils/appError";
import { NextFunction, Request, Response } from "express";

const handleDBCastError = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDBDuplicateError = (err: any) => {
  const message = `${Object.keys(err.keyPattern)[0]}, '${
    Object.values(err.keyValue)[0]
  }' has been used.`;
  return new AppError(message, 400);
};

const handleDBValidationError = (err: any) => {
  const values = Object.values(err.errors).map((val: any) => val.message);
  const message = `Invalid input data! ${values.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token! Please login again.", 401);
const handleJWTExpiredError = () =>
  new AppError("Token expired! Please login again.", 401);

const sendErrorDev = (err: AppError, res: Response) => {
  if (err.isOperational && !err.render) {
    return res.status(err.statusCode).json({
      error: err,
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.error(err);
    return res
      .status(err.statusCode)
      .render("error", { hideNav: true, message: err.message });
  }
};

const sendErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational && !err.render) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);
    return res
      .status(err.statusCode)
      .render("error", { hideNav: true, message: err.message });
  }
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(error.stack); // logs the error stack trace
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Internal server error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = JSON.parse(JSON.stringify(err)); // cause it is not ideal to manipulate function args. Also it was done this way cause the name property is only available when the output is JSON and not Object
    error.message = err.message;
    if (error.name === "CastError") {
      error = handleDBCastError(error); // Returns an Instance of our AppError which ofc will add the isOperational property set to true.
    }
    if (error.code === 11000) {
      error = handleDBDuplicateError(error);
    } // handles error due to value not unique in a field with the unique constraint
    if (error.name === "ValidationError") {
      error = handleDBValidationError(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, res);
  }
};
