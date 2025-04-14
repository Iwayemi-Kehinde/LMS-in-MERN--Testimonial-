import { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "../utils/ErrorHandler"
import userModel from "../models/user.model"
import CourseModel from "../models/course.model"
import { OrderModel } from "../models/order.model"
import nodemailer from "nodemailer"
import { notificationModel } from "../models/notification.model"

//create order
interface ICreateOrder {
  // userId: string,
  courseId: string,
  payment_info: string
}
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, payment_info } = req.body as ICreateOrder
    const user: any = await userModel.findById(req.user?._id)
    const isCourseExists = user?.courses.some((course: { courseId: string }) => course.courseId === courseId)

    if (isCourseExists) {
      return next(new ErrorHandler("Course already exists", 400))
    }
    const course: any = await CourseModel.findById(courseId)

    if (!course) {
      return next(new ErrorHandler("Course not found", 404))
    }
    const data: any = {
      courseId: course._id,
      userId: user._id,
      payment_info
    }
    const mailData = {
      order: {
        id: course._id.slice(0, 6),
        name: course.name,
        price: course.price,
        date: new Date().toLocaleDateString("en-US", {year:"numeric", month:"long",day:"numeric"})
      }
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    })
    try {
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "A new Order",
        html: `
        <div>${mailData.order.name}</div>
        <div>${mailData.order.price}</div>
        `
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
    user.courses.push({courseId: course?._id})
    await user.save()
    const notification = await notificationModel.create({
      user: user._id,
      title: "New Order",
      message: `You have a new order from ${course?.name}`
    })
    const order = await OrderModel.create(data)
    course.purchased ? course.purchased += 1 : course.purchased
    await course.save()
    res.status(201).json({
      success: true,
      order,
      user,
      notification
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}


//Only admin
export const getAllOrder = async (req:Request, res:Response, next:NextFunction) => {
  try {
     const order = await OrderModel.find({}).sort({createdAt: -1})
     res.status(200).json({
      success:true,
      order
     })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}