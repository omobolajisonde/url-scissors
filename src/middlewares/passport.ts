import passport from "passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
const JWTStrategy = Strategy;

import User from "../models/userModel";
const AppError = require("../utils/appError");

passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: (req) => {
        // Return the JWT token string
        return req.cookies.jwt;
      },
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        // Check if the user associated with token still exists
        const claimUser = await User.findById(payload.user._id);
        if (!claimUser)
          return done(
            new AppError("User associated with token no longer exists.", 401)
          );
        // Check if the password has been changed after token was issued
        const passwordModified = claimUser.passwordModified(payload.iat);
        if (passwordModified)
          return done(
            new AppError(
              "Invalid token! User changed password after this token was issued. Signin again to get a new token.",
              401
            )
          );
        // Grant access!
        done(null, payload.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
