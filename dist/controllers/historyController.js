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
exports.renderUrlAnalytics = exports.renderHistory = void 0;
const urlModel_1 = __importDefault(require("../models/urlModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.renderHistory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { page } = req.query;
    page = +page || 1;
    const limit = 2;
    const start = (page - 1) * limit;
    const nextStart = page * limit;
    const urls = yield urlModel_1.default.find({ userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
    const selectedUrls = urls.slice(start, page * limit);
    const prevPage = page - 1;
    const showNext = nextStart < urls.length;
    return res.status(200).render("history", {
        isLoggedIn: true,
        user: req.user,
        urls: selectedUrls,
        prevPage,
        showNext,
    });
}));
exports.renderUrlAnalytics = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let { urlAlias } = req.params;
    const url = yield urlModel_1.default.findOne({
        userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id,
        urlAlias,
    });
    return res.status(200).render("urlAnalytics", {
        isLoggedIn: true,
        user: req.user,
        url,
    });
}));
