import passport from "passport";
import { Router } from "express";

import { shortenURL, generateQRCode } from "../controllers/scissorsController";

const router = Router();

router.post(
  "/shortenURL",
  (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: object) => {
        if (err || !user) {
          shortenURL;
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  shortenURL
);
router.post("/qrcode", generateQRCode);

export default router;
