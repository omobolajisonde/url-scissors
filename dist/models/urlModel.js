"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Schema.Types.ObjectId;
const urlSchema = new Schema({
    longUrl: {
        type: String,
        required: [true, "Please provide the URL you are trying to shorten."],
        trim: true,
    },
    shortUrl: {
        type: String,
        required: true,
        trim: true,
    },
    urlAlias: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    userId: {
        type: ObjectId,
        ref: "User",
    },
    clicks: { type: Number, default: 0 },
    clicksSource: [String],
}, { timestamps: {} });
const Url = mongoose_1.default.model("Url", urlSchema);
exports.default = Url;
