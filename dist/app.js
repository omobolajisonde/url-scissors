"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const scissorsRoutes_1 = __importDefault(require("./routes/scissorsRoutes"));
const viewRoutes_1 = __importDefault(require("./routes/viewRoutes"));
const scissorsController_1 = require("./controllers/scissorsController");
const errorControllers_1 = __importDefault(require("./controllers/errorControllers"));
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
// Middleware for rate limiting
const appLimiter = (0, express_rate_limit_1.default)({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from your IP address, please try again later.",
});
app.use("/", appLimiter); // Use to limit repeated requests to the server
const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";
console.log(API_BASE_URL, "🎯🎯", process.env.API_BASE_URL);
app.use("/", viewRoutes_1.default);
app.get("/s/:urlAlias", scissorsController_1.redirectToOriginalURL);
app.use(`${API_BASE_URL}/auth`, authRoutes_1.default);
app.use(`${API_BASE_URL}/url`, scissorsRoutes_1.default);
// Any request that makes it to this part has lost it's way
app.all("*", (req, res, next) => {
    return res.status(404).render("error", {
        hideNav: true,
        message: `Can't find ${req.originalUrl} on this server! The resource you're looking for can't be found. Please check the URL before trying again.`,
    });
});
// Global error handling middleware
app.use(errorControllers_1.default);
exports.default = app;
