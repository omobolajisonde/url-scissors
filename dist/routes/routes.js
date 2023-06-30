"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const scissorsRoutes_1 = __importDefault(require("./scissorsRoutes"));
const viewRoutes_1 = __importDefault(require("./viewRoutes"));
const scissorsController_1 = require("./../controllers/scissorsController");
const router = (0, express_1.Router)();
const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";
router.use(`${API_BASE_URL}/auth`, authRoutes_1.default);
router.use(`${API_BASE_URL}/url`, scissorsRoutes_1.default);
router.get("/s/:urlAlias", scissorsController_1.redirectToOriginalURL);
router.use("/", viewRoutes_1.default);
exports.default = router;
