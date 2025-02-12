import { IUser } from "../models/user.model";
import { Response } from "express";
import { redis } from "./redis";

export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  await redis.set(user._id as any, JSON.stringify(user));


  res.cookie("access_token", accessToken, {
    expires: new Date(Date.now() + 15 * 60 * 1000), 
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.cookie("refresh_token", refreshToken, {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.status(statusCode).json({
    success: true,
    user, 
    accessToken
  });
};
