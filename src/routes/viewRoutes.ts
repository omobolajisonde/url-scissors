import passport from "passport";
import { Router } from "express";
import AppError from "../utils/appError";
import {
  renderHistory,
  renderUrlAnalytics,
} from "../controllers/historyController";
const router = Router();

router.get("/healthCheck", (req, res, next) => {
  return res
    .status(200)
    .json({ status: "success", message: "Server up and running!" });
});

router.get(
  "/",
  (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: object) => {
        if (err || !user) {
          return res
            .status(200)
            .render("index", { isLoggedIn: false, script: "index" });
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  (req, res, next) => {
    return res
      .status(200)
      .render("index", { isLoggedIn: true, user: req.user, script: "index" });
  }
);

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

router.get(
  "/history",
  (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: object) => {
        if (err || !user) {
          throw new AppError(
            "Forbidden! Only logged in users have history of shortned URLs.",
            403,
            true
          );
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  renderHistory
);

router.get(
  "/history/:urlAlias",
  (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: object) => {
        if (err || !user) {
          throw new AppError("Forbidden", 403);
        }
        // Authentication successful, proceed with the route handler
        req.user = user;
        next();
      }
    )(req, res, next);
  },
  renderUrlAnalytics
);

export default router;
