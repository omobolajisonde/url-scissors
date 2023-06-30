"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const appError_1 = __importDefault(require("../utils/appError"));
const historyController_1 = require("../controllers/historyController");
const router = (0, express_1.Router)();
router.get("/healthCheck", (req, res, next) => {
    return res
        .status(200)
        .json({ status: "success", message: "Server up and running!" });
});
router.get("/", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return res
                .status(200)
                .render("index", { isLoggedIn: false, script: "index" });
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
    })(req, res, next);
}, (req, res, next) => {
    return res
        .status(200)
        .render("index", { isLoggedIn: true, user: req.user, script: "index" });
});
router.get("/signup", (req, res, next) => {
    return res.status(200).render("signup", { hideNav: true, script: "signup" });
});
router.get("/signin", (req, res, next) => {
    return res.status(200).render("signin", { hideNav: true, script: "signin" });
});
router.get("/forgotpassword", (req, res, next) => {
    return res
        .status(200)
        .render("forgotPassword", { hideNav: true, script: "forgotPassword" });
});
router.get("/resetpassword", (req, res, next) => {
    return res
        .status(200)
        .render("resetPassword", { hideNav: true, script: "resetPassword" });
});
router.get("/history", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            throw new appError_1.default("Forbidden! Only logged in users have history of shortned URLs.", 403, true);
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
    })(req, res, next);
}, historyController_1.renderHistory);
router.get("/history/:urlAlias", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            throw new appError_1.default("Forbidden", 403);
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
    })(req, res, next);
}, historyController_1.renderUrlAnalytics);
exports.default = router;
