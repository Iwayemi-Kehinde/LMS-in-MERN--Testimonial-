import {NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { ErrorHandler } from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";


export interface CustomRequest extends Request {
  user: any
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token
  if(!access_token) {
    return next(new ErrorHandler("Please Login to access this resource", 401))
  }
  const decoded = jwt.verify(access_token, process.env.access_token as Secret) as JwtPayload
  if(!decoded){
    return next(new ErrorHandler("Please Login to access this resource", 401))
  }
  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    try{
      await updateAccessToken(req, res, next)
    } catch (err: any) {
      console.log("An error occured " + err.message)
    }
  } else {
    const user = await redis.get(decoded.id)
    if (!user) {
      return next(new ErrorHandler("User does not exist", 404))
    }
    req.user = JSON.parse(user)
    next()
  }
} 
