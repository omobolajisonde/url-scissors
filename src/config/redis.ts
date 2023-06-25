import { createClient, RedisClientType } from "redis";

const REDIS_PORT = process.env.REDIS_PORT || 8080;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || null;

class Cache {
  redis: RedisClientType;
  constructor() {
    this.redis = null;
  }

  async connect() {
    try {
      this.redis = createClient({
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
    } catch (error) {
      console.log("Redis connection error:", error);
    }
  }
}

export default new Cache();
