"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
dotenv_1.default.config(); // loads enviroment variables into process.env
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";
// connectToMongoDB(); // connects to a MongoDB server
// listens for connections
app.listen(+PORT, HOST, () => {
    console.log(`Server started at port, ${PORT}...`);
});
