import { redisClient } from "./redis.DB.js";

export const revokedKey = ({userId,jti})=>{
  return `revokeToken::${userId}::${jti}`
}
export const getAllRevokedKeys = ({userId})=>{
  return `revokeToken::${userId}::*`
}

export const setRedis = async ({ key, value, ttl } = {}) => {
  try {
    const data = typeof value === "object" ? JSON.stringify(value) : value;
    return ttl
      ? await redisClient.set(key, data, { EX: ttl })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log("fail to set redis", error);
  }
};

export const update = async ({ key, value, ttl } = {}) => {
  try {
    if (!await redisClient.exists(key)) {
        return 0;
    }
    const data = typeof value === "object" ? JSON.stringify(value) : value;
    return ttl
      ? await redisClient.set(key, data, { EX: ttl })
      : await redisClient.set(key, data);
  } catch (error) {
    console.log("fail to update data redis", error);
  }
};

export const getRedis = async (key) => {
  try {
    const data = await redisClient.get(key);
    try {
        return JSON.parse(data);
    } catch (error) {
        return data
    }return 
  } catch (error) {
    console.log("fail to get redis", error);
  }
}
export const deleteRedis = async (key) => {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.log("fail to delete redis", error);
  }
}
