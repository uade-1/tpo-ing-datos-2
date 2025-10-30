import Redis from "ioredis";

let redis: Redis | null = null;

const connectRedis = async (): Promise<Redis> => {
  if (redis) {
    return redis;
  }

  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD || undefined,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      keepAlive: 30000,
    };

    redis = new Redis(redisConfig);

    redis.on("connect", () => {
      console.log("Redis connected successfully");
    });

    redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    redis.on("close", () => {
      console.log("Redis connection closed");
    });

    redis.on("reconnecting", () => {
      console.log("Redis reconnecting...");
    });

    // Test the connection
    await redis.ping();
    console.log("Redis ping successful");

    return redis;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error;
  }
};

const getRedis = (): Redis => {
  if (!redis) {
    throw new Error("Redis not initialized. Call connectRedis() first.");
  }
  return redis;
};

const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log("Redis disconnected");
  }
};

export { connectRedis, getRedis, disconnectRedis };
export default connectRedis;
