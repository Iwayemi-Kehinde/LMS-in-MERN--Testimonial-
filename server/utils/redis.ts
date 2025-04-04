require("dotenv").config({})
import {Redis} from "ioredis"

function redisConn() {
  if(process.env.REDIS_URL) {
    console.log("Redis connected!")
    return process.env.REDIS_URL
  } else {
    throw new Error("Redis connection failed");
  }
} 

export const redis = new Redis(redisConn())