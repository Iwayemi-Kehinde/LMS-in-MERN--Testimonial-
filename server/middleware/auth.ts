import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { ErrorHandler } from "../utils/ErrorHandler";

export const isAuthenticated = async (req: Request, res:Response, next:NextFunction) => {
  const access_token = req.cookies.access_token
  if(!access_token) {
    return next(new ErrorHandler("Please login to access this resource", 404))
  }
  const decoded = jwt.decode(access_token) as JwtPayload
  if(!decoded){
    return next(new ErrorHandler("Access token is not valid", 400))
  }

  //check if the access token has expired
  if(decoded.exp && decoded.exp > Date.now() / 1000) {
    try {
      
    } catch (error) {
      
    }
  }
}

/**
 * what is the esseence of JWT.decode()
 */