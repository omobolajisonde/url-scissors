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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // loads enviroment variables into process.env
const app_1 = __importDefault(require("../app"));
// for testing purposes, we use the test DB
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
// A JWT which encodes the one user details which was created before in our database to authenticate protected routes during testing.
const TEST_JWT = process.env.TEST_JWT;
//  Runs before all the tests
beforeAll((done) => {
    mongoose_1.default.connect(TEST_DATABASE_URL);
    mongoose_1.default.connection.on("connected", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Connected to MongoDB Successfully");
        done();
    }));
    mongoose_1.default.connection.on("error", (err) => {
        console.log(err, "An error occurred while connecting to MongoDB");
        done();
    });
});
//  Runs after all the tests
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.connection.close();
}));
describe("URL shortening", () => {
    let url;
    test("POST /api/v1/url/shortenURL", () => __awaiter(void 0, void 0, void 0, function* () {
        const newURL = {
            longUrl: "https://docs.google.com/spreadsheets/d/1A2PaQKcdwO_lwxz9bAnxXnIQayCouZP6d-ENrBz_NXc/edit#gid=0",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/v1/url/shortenURL`)
            .set("Cookie", `jwt=${TEST_JWT}`)
            .send(newURL);
        expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
        url = response.body.data.url;
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toHaveProperty("url");
        expect(response.body.data.url.clicks).toBe(0);
    }), 900000);
    test("POST /api/v1/url/qrcode", () => __awaiter(void 0, void 0, void 0, function* () {
        const URL = {
            Url: "https://docs.google.com/spreadsheets/d/1A2PaQKcdwO_lwxz9bAnxXnIQayCouZP6d-ENrBz_NXc/edit#gid=0",
        };
        const response = yield (0, supertest_1.default)(app_1.default).post(`/api/v1/url/qrcode`).send(URL);
        expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body.data).toHaveProperty("url");
    }));
    test("GET /s/:urlAlias", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get(`/s/${url.urlAlias}`);
        expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
        // Test if the short URL really links back to the Original URL
        expect(response.headers["Location"]).toBe(url.longUrl);
    }), 900000);
});
