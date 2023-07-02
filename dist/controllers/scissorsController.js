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
exports.generateQRCode = exports.redirectToOriginalURL = exports.shortenURL = void 0;
const crypto_1 = __importDefault(require("crypto"));
const qrcode_1 = __importDefault(require("qrcode"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const validateURL_1 = __importDefault(require("../utils/validateURL"));
const appError_1 = __importDefault(require("../utils/appError"));
const urlModel_1 = __importDefault(require("../models/urlModel"));
const redis_1 = __importDefault(require("../config/redis"));
exports.shortenURL = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // Get the longURL to shorten
    const { longUrl, customAlias } = req.body;
    // Check if the user has a short url for the inputted long url
    const existingUrl = yield urlModel_1.default.findOne({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        longUrl,
    });
    if (existingUrl) {
        return res
            .status(200)
            .json({ status: "success", data: { url: existingUrl } });
    }
    // Confirm it's a valid URL
    const isValid = yield (0, validateURL_1.default)(longUrl);
    if (isValid) {
        // Create MD5 (Message Digest Algorithm 5) hash
        const hash = customAlias ||
            crypto_1.default
                .createHash("md5")
                .update(((_b = req.user) === null || _b === void 0 ? void 0 : _b.email)
                ? ((_c = req.user) === null || _c === void 0 ? void 0 : _c.email) + longUrl
                : longUrl)
                .digest("hex"); // Use custom alias if provided by user, else generate an hash alias
        const urlAlias = hash.slice(0, 6);
        const shortUrl = `${req.protocol}://${req.get("host")}/s/${urlAlias}`;
        const url = yield urlModel_1.default.create({
            userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
            longUrl,
            shortUrl,
            urlAlias,
        });
        // Cache Url info
        yield redis_1.default.redis.set(`url:${url.urlAlias}`, JSON.stringify(url));
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
        // Update click count
        url.clicks = url.clicks + 1;
        // Get source
        const referringSite = req.get("Referer");
        if (referringSite) {
            // Update clicks source
            url.clicksSource.push(referringSite);
        }
        // Save updates
        yield url.save();
        // Update Cache
        yield redis_1.default.redis.set(`url:${url.urlAlias}`, JSON.stringify(url));
        // Redirect to the original URL
        return res.redirect(url.longUrl);
    }
    else {
        throw new appError_1.default("Not found!", 404, true);
    }
}));
exports.generateQRCode = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { Url } = req.body;
    qrcode_1.default.toDataURL(Url, {
        errorCorrectionLevel: "H",
        type: "image/png",
        margin: 4,
        scale: 4,
        // color: {
        //   dark: "#333333",
        //   light: "#3498db",
        // },
    }, (err, dataURI) => {
        if (err) {
            throw new appError_1.default("Error generating QR code for, " + Url, 500);
        }
        return res
            .status(201)
            .json({ status: "success", data: { url: dataURI } });
    });
}));
