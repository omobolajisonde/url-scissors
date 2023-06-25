"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const appError_1 = __importDefault(require("./appError"));
function validateUrl(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https_1.default : http_1.default;
        // Sends a HEAD request to the url
        const request = protocol.request(url, { method: "HEAD" }, (response) => {
            // Check if the response status code is in the 200 range
            if (response.statusCode >= 200 &&
                response.statusCode < 300) {
                resolve(true); // URL is valid and links to a source
            }
            else {
                resolve(false); // URL is valid, but the source is not accessible
            }
        });
        request.on("error", (error) => {
            reject(new appError_1.default("Your internet connection is very unstable.", 500)); // URL is invalid or an error occurred
        });
        request.end();
    });
}
exports.default = validateUrl;
