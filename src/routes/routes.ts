import { Router } from "express";

import authRouter from "./authRoutes";
import scrissorsRouter from "./scissorsRoutes";
import viewsRouter from "./viewRoutes";
import { redirectToOriginalURL } from "./../controllers/scissorsController";

const router = Router();

const API_BASE_URL = process.env.API_BASE_URL || "/api/v1";
router.use(`${API_BASE_URL}/auth`, authRouter);
router.use(`${API_BASE_URL}/url`, scrissorsRouter);
router.get("/s/:urlAlias", redirectToOriginalURL);

router.use("/", viewsRouter);

export default router;
