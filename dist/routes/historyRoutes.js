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
router.get("/", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            throw new appError_1.default("Forbidden", 403);
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
    })(req, res, next);
}, historyController_1.renderHistory);
router.get("/:urlAlias", (req, res, next) => {
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
