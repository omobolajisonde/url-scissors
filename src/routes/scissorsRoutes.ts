import { Router } from "express";

import {
  shortenURL,
  redirectToOriginalURL,
} from "../controllers/scissorsController";

const router = Router();

router.get("/:urlAlias", redirectToOriginalURL);
router.post("/shortenURL", shortenURL);
// router.patch("/:id", updateTodo);
// router.delete("/:id", deleteTodo);

export default router;
