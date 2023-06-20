"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const JWTStrategy = passport_jwt_1.Strategy;
const userModel_1 = __importDefault(require("../models/userModel"));
const AppError = require("../utils/appError");
passport_1.default.use("jwt", new JWTStrategy({
    jwtFromRequest: (req) => {
        // Return the JWT token string
        return req.cookies.jwt;
    },
    secretOrKey: process.env.JWT_SECRET,
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the user associated with token still exists
        const claimUser = yield userModel_1.default.findById(payload.user._id);
        if (!claimUser)
            return done(new AppError("User associated with token no longer exists.", 401));
        // Check if the password has been changed after token was issued
        const passwordModified = claimUser.passwordModified(payload.iat);
        if (passwordModified)
            return done(new AppError("Invalid token! User changed password after this token was issued. Signin again to get a new token.", 401));
        // Grant access!
        done(null, payload.user);
    }
    catch (error) {
        done(error);
    }
})));
