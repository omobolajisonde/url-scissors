"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Any request that makes it to this part has lost it's way
app.all("*", (req, res, next) => {
    return res.status(404).json({
        status: "failed",
        message: `Can't find ${req.originalUrl} on this server! The resource you're looking for can't be found. Please check the URL before trying again.`,
    });
});
// Global error handling middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "An Internal server error has occured!";
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});
exports.default = app;
