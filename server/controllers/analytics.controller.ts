import {Request, Response, NextFunction} from 
"express"
import { ErrorHandler } from "../utils/ErrorHandler"
import { generateLast12MonthsDate } from "../utils/analytics.generator"
import userModel from "../models/user.model"
import { OrderModel } from "../models/order.model"
import CourseModel from "../models/course.model"

/** Only Admin */

export const getUserAnalytics = async (req:Request, res:Response, next: NextFunction) => {
  try {
    const users = await generateLast12MonthsDate(userModel as any)
    res.status(200).json({
      success:true,
      users
    })
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
}


export const getOrderAnalytics = async (req:Request, res:Response, next: NextFunction) => {
  try {
    const orders = await generateLast12MonthsDate(OrderModel)
    res.status(200).json({
      success:true,
      orders
    })
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
}


export const getCourseAnalytics = async (req:Request, res:Response, next: NextFunction) => {
  try {
    const course = await generateLast12MonthsDate(CourseModel)
    res.status(200).json({
      success:true,
      course
    })
  } catch (error:any) {
    return next(new ErrorHandler(error.message, 500))
  }
}