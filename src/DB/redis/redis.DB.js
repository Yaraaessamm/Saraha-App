import { createClient } from "redis";

export const redisClient = createClient({
  url: "rediss://default:gQAAAAAAAQSzAAIncDFjODQ3ODVlOWQzYTM0OGJlYTM5YzZiZDViNWEyOTE0NnAxNjY3Mzk@comic-stork-66739.upstash.io:6379",
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("success to connect with redis 😁");
  } catch (error) {
    console.log("fail to connect with redis", error);
  }
};