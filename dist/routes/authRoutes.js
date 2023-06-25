"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/signup", authController_1.signUpUser);
router.post("/signin", authController_1.signInUser);
router.post("/forgotPassword", authController_1.forgotPassword);
router.patch("/resetPassword/:token", authController_1.resetPassword);
exports.default = router;