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
exports.resetPassword = exports.forgotPassword = exports.signInUser = exports.signUpUser = void 0;
const crypto_1 = __importDefault(require("crypto"));
const appError_1 = __importDefault(require("../utils/appError"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const emailSender_1 = __importDefault(require("../utils/emailSender"));
const genToken_1 = __importDefault(require("../utils/genToken"));
exports.signUpUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user = yield userModel_1.default.create({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
    });
    user.password = undefined; // so the password won't show in the output and as payload in the token
    user.__v = undefined;
    const token = (0, genToken_1.default)(user);
    return res.status(201).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
}));
exports.signInUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new appError_1.default("Bad request! Email and Password is required.", 400));
    const user = yield userModel_1.default.findOne({ email }).select("+password");
    if (!user || !(yield user.isCorrectPassword(password)))
        return next(new appError_1.default("Unauthenticated! Email or Password incorrect.", 401));
    user.password = undefined;
    user.__v = undefined;
    const token = (0, genToken_1.default)(user);
    return res.status(200).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
}));
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user)
        return next(new appError_1.default("User does not exist!", 404));
    const resetToken = user.genResetToken();
    user.save({ validateBeforeSave: false }); // persists the changes made in  genResetToken function
    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
    const body = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: <a href=${resetPasswordURL}>${resetPasswordURL}</a>.\nIf you didn't forget your password, please ignore this email!`;
    const subject = "Your password reset token (valid for 10 min)";
    try {
        yield (0, emailSender_1.default)({ email, body, subject });
        return res.status(200).json({
            status: "success",
            message: "Check your email inbox, a link to reset your password has been sent.",
        });
    }
    catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiryTime = undefined;
        yield user.save({ validateBeforeSave: false });
        console.log(error);
        return next(new appError_1.default("Something went wrong while sending a password resent link to your email. Please try again later.", 500));
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    // Looks for user with the reset token and unexpired!
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiryTime: { $gt: Date.now() }, // this confirms that the token hasn't expired
    });
    if (!user)
        return next(new appError_1.default("Password reset token is invalid or has expired!", 400));
    const { password, confirmPassword } = req.body;
    // Resets the password
    user.password = password;
    user.confirmPassword = confirmPassword;
    // clears the passwordResetToken details on successful password update
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiryTime = undefined;
    yield user.save({ validateModifiedOnly: true }); // saves and update the passwordModifiedAt field
    // 4) Log the user in, send JWT
    user.password = undefined;
    user.passwordModifiedAt = undefined;
    const jwttoken = (0, genToken_1.default)(user);
    return res.status(200).json({
        status: "success",
        token: jwttoken,
        data: {
            user,
        },
    });
}));
