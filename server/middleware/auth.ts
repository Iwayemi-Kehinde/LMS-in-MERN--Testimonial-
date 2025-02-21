import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { ErrorHandler } from "../utils/ErrorHandler";
import { redis } from "../utils/redis";
import { updateAccessToken } from "../controllers/user.controller";


export interface CustomRequest extends Request {
  user: any
}

export const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const access_token = req.cookies.access_token
  if (!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 401))
  }
  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as Secret) as JwtPayload
  if (!decoded) {
    return next(new ErrorHandler("Please login to access this resource", 401))
  }
  if (decoded.exp && decoded.exp <= Date.now() / 1000) {
    await updateAccessToken(req, res, next)
  } else {
    const session: any = await redis.get(decoded.id)
    const user = JSON.parse(session)
    req.user = user
    next()
  }
}


export const authorizedRoles = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if(roles.includes(req.user?.role)) {
      next()
    } {
      return next(new ErrorHandler(`role ${req.user?.role} is not allowed`, 403))
    }
  }
}