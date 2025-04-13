import { Request, Response, NextFunction } from "express";
import { notificationModel } from "../models/notification.model";
import { ErrorHandler } from "../utils/ErrorHandler";

//get notification -- only admin
export const getNotifications =  async (req:Request, res:Response, next:NextFunction) => {
  try {
    const notifications = await notificationModel.find({}).sort({createdAt: -1})
    res.status(200).json({
      success: true,
      notifications
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

