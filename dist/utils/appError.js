"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, render = false) {
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.render = render;
        this.message = message;
        this.statusCode = statusCode;
        this.render = render;
        this.status = `${this.statusCode}`.startsWith("4")
            ? "Client Error!"
            : "Internal Server Error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor); // persists the function where the error occured in the Error stack trace. (not 100% sure)
    }
}
exports.default = AppError;
