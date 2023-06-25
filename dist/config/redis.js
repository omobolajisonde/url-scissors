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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const REDIS_PORT = process.env.REDIS_PORT || 8080;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;
class Cache {
    constructor() {
        this.redis = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.redis = (0, redis_1.createClient)({
                    password: REDIS_PASSWORD,
                    socket: {
                        host: REDIS_HOST,
                        port: +REDIS_PORT,
                    },
                });
                this.redis.connect();
                this.redis.on("connect", () => {
                    console.log("Redis connected");
                });
                this.redis.on("error", (error) => {
                    console.log("Redis connection error:", error);
                });
            }
            catch (error) {
                console.log("Redis connection error:", error);
            }
        });
    }
}
exports.default = new Cache();
