"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const scissorsRoutes_1 = __importDefault(require("./routes/scissorsRoutes"));
const viewRoutes_1 = __importDefault(require("./routes/viewRoutes"));
const app = (0, express_1.default)();
// Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.set("view engine", "pug");
app.set("views", path_1.default.join(__dirname, "views"));
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Initialize passport
app.use(passport_1.default.initialize());
require("./middlewares/passport");
// Body parsers middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";
app.use(`${API_BASE_URL}/auth`, authRoutes_1.default);
app.use(`${API_BASE_URL}/url`, scissorsRoutes_1.default);
app.use("/", viewRoutes_1.default);
// Any request that makes it to this part has lost it's way
app.all("*", (req, res, next) => {
    return res.status(404).json({
        status: "failed",
        message: `Can't find ${req.originalUrl} on this server! The resource you're looking for can't be found. Please check the URL before trying again.`,
    });
});
// Global error handling middleware
app.use((err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "An Internal server error has occured!";
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});
exports.default = app;
