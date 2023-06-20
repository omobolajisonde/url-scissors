import { Router } from "express";

import {
  signUpUser,
  signInUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

export default router;
