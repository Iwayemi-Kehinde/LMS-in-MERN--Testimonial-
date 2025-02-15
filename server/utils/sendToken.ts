import { IUser } from "../models/user.model";
import { Response } from "express";
import { redis } from "./redis";

export const sendToken = async (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  await redis.set(user._id as any, JSON.stringify(user));


  res.cookie("access_token", accessToken, {
    expires: new Date(Date.now() + 60000 * 5), 
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  res.cookie("refresh_token", refreshToken, {
    expires: new Date(Date.now() + 60000 * 60 * 24 * 3),
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
