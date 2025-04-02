import { Request, Response, NextFunction } from "express"
import cloudinary from "cloudinary"
import CourseModel from "../models/course.model"
import { ErrorHandler } from "../utils/ErrorHandler"

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    if (data.thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, { folder: "courses" })
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.public_url
      }
    } else {
      return next(new ErrorHandler("Provide Thumbnail", 400))
    }
    const course = await CourseModel.create(data)
    res.status(200).json({
      success: true,
      messsage: "Course created successfully",
      course
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}
