require("dotenv").config()
import {Redis} from "ioredis"

function redisClient() {
  if(process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }
  throw new Error('Redis connected failed')
}


export const redis = new Redis(redisClient())