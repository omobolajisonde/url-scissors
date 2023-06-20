"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(200).render("index", { isLoggedIn: false });
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
exports.default = router;
