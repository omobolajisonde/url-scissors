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
exports.redirectToOriginalURL = exports.shortenURL = void 0;
const crypto_1 = __importDefault(require("crypto"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const validateURL_1 = __importDefault(require("../utils/validateURL"));
const appError_1 = __importDefault(require("../utils/appError"));
const urlModel_1 = __importDefault(require("../models/urlModel"));
exports.shortenURL = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the longURL to shorten
    const { longUrl } = req.body;
    // Check if the user has a short url for the inputted long url
    const existingUrl = yield urlModel_1.default.findOne({ userId: null, longUrl });
    if (existingUrl) {
        return res.status(200).json({ status: "success", data: { existingUrl } });
    }
    // Confirm it's a valid URL
    const isValid = yield (0, validateURL_1.default)(longUrl);
    if (isValid) {
        // Create MD5 (Message Digest Algorithm 5) hash
        const hash = crypto_1.default.createHash("md5").update(longUrl).digest("hex");
        const urlAlias = hash.slice(0, 6);
        const shortUrl = `${req.protocol}://${req.get("host")}/${urlAlias}`;
        const url = yield urlModel_1.default.create({ longUrl, shortUrl, urlAlias });
        return res.status(201).json({ status: "success", data: { url } });
    }
    else {
        throw new appError_1.default("The long URL you provided is techically valid, but source is not accessible.", 400);
    }
}));
exports.redirectToOriginalURL = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the url alias from the url params
    const { urlAlias } = req.params;
    // Check if the current user has such url alias in their shortned url collection
    const url = yield urlModel_1.default.findOne({ urlAlias });
    if (url) {
        // Redirect to the original URL
        return res.redirect(url.longUrl);
    }
    else {
        throw new appError_1.default("Not found!", 404);
    }
}));
