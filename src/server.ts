import dotenv from "dotenv";
dotenv.config(); // loads enviroment variables into process.env
import { createServer } from "http";
import Cache from "./config/redis";

import app from "./app";
import connectToMongoDB from "./config/db";

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const httpServer = createServer(app);

(async function () {
  await connectToMongoDB(); // connects to a MongoDB server
  // Connect to Redis Cloud server
  await Cache.connect();
  // listens for connections
  httpServer.listen(+PORT, HOST, () => {
    console.log(`Server started at port, ${PORT}...`);
  });
})();
