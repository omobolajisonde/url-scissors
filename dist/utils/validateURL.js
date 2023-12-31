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
const axios_1 = __importDefault(require("axios"));
const appError_1 = __importDefault(require("./appError"));
function validateUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.head(url);
            if (response.status >= 200 && response.status < 300) {
                return true; // URL is valid and links to a source
            }
            else {
                return false; // URL is valid, but the source is not accessible
            }
        }
        catch (error) {
            if (error.response) {
                // Error response received from the server
                if (error.response.status === 401) {
                    throw new appError_1.default("Authentication required to access the resource.", 500);
                }
                else {
                    throw new appError_1.default(`Error: ${error.response.status} ${error.response.statusText}`, 500);
                }
            }
            else {
                // Other types of errors
                throw new appError_1.default("Invalid URL or poor internet connection.", 500);
            }
        }
    });
}
exports.default = validateUrl;
