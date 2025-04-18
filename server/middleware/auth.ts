import {Request, Response, NextFunction}  from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken"
import { redis } from "../utils/redis";

export const isAuthenticated = async (req:Request, res:Response, next:NextFunction) => {
  const accessToken = req.cookies.access_token
  if(!accessToken) {
    return next(new ErrorHandler("Please Login to access that resource", 401))
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as JwtPayload
  const user = await redis.get(decoded.id) 
  if(!user) {
    return next(new ErrorHandler("Please Login to access this resource", 400))
  }
  req.user = JSON.parse(user)

  next()
}

//Validate user role
export const authorizeRole = (...roles: string[]) => {
  return (req:Request, res:Response, next:NextFunction) => {
    const role = req.user?.role || ""
    if(!roles.includes(role)) {
      return next(new ErrorHandler(`Role ${role} is not allowed`, 403))
    }
    next()
  }
}

