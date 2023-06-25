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
const userModel_1 = __importDefault(require("../models/userModel"));
// for testing purposes, we use the test DB
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
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
    yield userModel_1.default.findOneAndDelete({ email: "wisdomomobolaji@gmail.com" });
    mongoose_1.default.connection.close();
}));
describe("Test Auth", () => {
    test("POST /api/v1/auth/signup", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            firstName: "Omobolaji",
            lastName: "Sonde",
            email: "wisdomomobolaji@gmail.com",
            password: "qwerty",
            confirmPassword: "qwerty",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/v1/auth/signup`)
            .set("Content-Type", "application/json")
            .send(newUser);
        expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("success");
        expect(response.body).toHaveProperty("token");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data.user.email).toBe("wisdomomobolaji@gmail.com");
    }));
    test("POST /api/v1/auth/signin", () => __awaiter(void 0, void 0, void 0, function* () {
        const loginDetails = {
            email: "wisdomomobolaji@gmail.com",
            password: "qwerty",
        };
        const response = yield (0, supertest_1.default)(app_1.default)
            .post(`/api/v1/auth/signin`)
            .set("Content-Type", "application/json")
            .send(loginDetails);
        expect(response.headers["content-type"]).toBe("application/json; charset=utf-8");
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("success");
        expect(response.body).toHaveProperty("token");
        expect(response.body.data).toHaveProperty("user");
        expect(response.body.data.user.email).toBe("wisdomomobolaji@gmail.com");
    }));
});
