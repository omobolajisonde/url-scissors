"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleDBCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDBDuplicateError = (err) => {
    const message = `${Object.keys(err.keyPattern)[0]}, '${Object.values(err.keyValue)[0]}' has been used.`;
    return new appError_1.default(message, 400);
};
const handleDBValidationError = (err) => {
    const values = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data! ${values.join(". ")}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default("Invalid token! Please login again.", 401);
const handleJWTExpiredError = () => new appError_1.default("Token expired! Please login again.", 401);
const sendErrorDev = (err, res) => {
    if (err.isOperational && !err.render) {
        return res.status(err.statusCode).json({
            error: err,
            status: err.status,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        console.error(err);
        return res
            .status(err.statusCode)
            .render("error", { hideNav: true, message: err.message });
    }
};
const sendErrorProd = (err, res) => {
    if (err.isOperational && !err.render) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.error(err);
        return res
            .status(err.statusCode)
            .render("error", { hideNav: true, message: err.message });
    }
};
exports.default = (err, req, res, next) => {
    // console.log(error.stack); // logs the error stack trace
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Internal server error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === "production") {
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
