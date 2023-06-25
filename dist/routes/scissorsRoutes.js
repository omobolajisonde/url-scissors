"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = require("express");
const scissorsController_1 = require("../controllers/scissorsController");
const router = (0, express_1.Router)();
router.post("/shortenURL", (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err || !user) {
            scissorsController_1.shortenURL;
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
    })(req, res, next);
}, scissorsController_1.shortenURL);
router.post("/qrcode", scissorsController_1.generateQRCode);
exports.default = router;
