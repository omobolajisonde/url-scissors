import passport from "passport";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    passport.authenticate(
      "jwt",
      { session: false },
      (err: Error, user: object) => {
        if (err || !user) {
          return res.status(200).render("index", { isLoggedIn: false });
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

export default router;
