import { Request, Response, NextFunction } from "express"
import cloudinary from "cloudinary"
import CourseModel from "../models/course.model"
import { ErrorHandler } from "../utils/ErrorHandler"
import { redis } from "../utils/redis"
import mongoose from "mongoose"
import nodemailer, { Transporter } from "nodemailer"

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    if (data.thumbnail) {
      const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, { folder: "courses" })
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.public_url
      }
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


export const editCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body
    if (data.thumbnail) {
      await cloudinary.v2.uploader.destroy(data.public_id)
      const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
        folder: "courses"
      })
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(data.thumbnail, {
        folder: "courses"
      })
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url
      }
    }
    const editedCourse = await CourseModel.findByIdAndUpdate(req.params.id,
      {
        $set: data
      },
      { new: true }
    )
    res.status(200).json({
      success: true,
      editedCourse
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

//Get single course without purchase
export const getSingleCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCacheExist = await redis.get(req.params.id)
    if (isCacheExist) {
      const course = JSON.parse(isCacheExist)
      res.status(200).json({
        success: true,
        course
      })
    } else {
      const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
      await redis.set(req.params.id, JSON.stringify(course))
      res.status(200).json({
        success: true,
        course
      })
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

//Get all course without purchase
export const getAllCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCacheExist = await redis.get("allCourses")
    if (isCacheExist) {
      const course = JSON.parse(isCacheExist)
      res.status(200).json({
        success: true,
        course
      })
    } else {
      const course = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")
      await redis.set("allCourses", JSON.stringify(course))
      res.status(200).json({
        success: true,
        course
      })
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

export const getCourseByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.id
    const userCourse = req.user?.courses as any
    const courseExists = userCourse.find((userCourse: { courseId: string }) => userCourse.courseId === courseId)
    if (!courseExists) {
      return next(new ErrorHandler("You're not eligible to access this course", 404))
    }
    const course = await CourseModel.findById(courseId)
    const content = course?.courseData
    res.status(200).json({
      success: true,
      content
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

interface IAddQuestionData {
  contentId: string,
  question: string
}

export const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { contentId, question } = req.body as IAddQuestionData
    const courseId = req.params.id
    const course = await CourseModel.findById(courseId)
    if (!course) {
      return next(new ErrorHandler("Course not found", 404))
    }
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid content ID", 400))
    }
    const courseContent = course.courseData.find((item: any) => item._id.equals(contentId))

    const newQuestion: any = {
      user: req.user,
      question,
      questionReplies: []
    }
    courseContent?.questions.push(newQuestion)
    await course.save()
    res.status(200).json({
      success: true,
      courseContent
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

interface IAddAnswerData {
  answer: string,
  courseId: string,
  contentId: string,
  questionId: string
}

export const addAnswer = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { answer, courseId, contentId, questionId } = req.body as IAddAnswerData

    const course = await CourseModel.findById(courseId)

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return next(new ErrorHandler("Invalid Content ID", 400))
    }

    const courseContent = course?.courseData.find((item) => item._id === contentId)

    if (!courseContent) {
      return next(new ErrorHandler("Invalid Content ID", 400))
    }

    const question = courseContent.questions.find((item: any) => item._id === questionId)

    if (!question) {
      return next(new ErrorHandler("Invalid Question ID", 400))
    }

    const newAnswer: any = {
      user: req.user,
      answer
    }

    question.questionReplies?.push(newAnswer)

    await course?.save()

    if (req.user?._id === question.user._id) {
      //Create a notification
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title
      }
     
      const transport: Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_PASS,
          pass: process.env.PASSWORD
        }
      })

      try {
        await transport.sendMail({
          from: process.env.EMAIL,
          to: question.user.email,
          subject: "Question answered",
          html: `
          <h1>${data.name}</h1>
          <h2>${data.title}</h2>
          `
        })
        res.status(200).json({
          success: true,
          course
        })
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message
        })
      }
    }

  } catch (error: any) {
    return next(new ErrorHandler(error.messsage, 500))
  }
}


// Add review in course 
interface IAddReviewData {
  review: string,
  courseId: string,
  rating: number,
  userId: string
}

export const addReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userCourseList = req.user?.courses
    const courseId = req.params.id
    const courseExists = userCourseList?.some((item: any) => item.courseId === courseId)
    if (!courseExists) {
      return next(new ErrorHandler("Course does not exist", 500))
    }
    const course = await CourseModel.findById(courseId)
    const { review, rating } = req.body as IAddReviewData
    const reviewData: any = {
      user: req.user,
      rating,
      comment: review,
    }
    course?.reviews.push(reviewData)
    await course?.save()
    const notification = {
      title: "New reivew recived",
      message: `${req.user?.name} has given a reivew to your course (${course?.name})`
    }
    res.status(200).json({
      success: true,
      course
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}


interface IAddReplyToReview {
  comment: string,
  reviewId: string,
  courseId: string
}

export const addReplyToReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {comment, reviewId, courseId} = req.body as IAddReplyToReview
    const course = await CourseModel.findById(courseId)
    if(!course) {
      return next(new ErrorHandler("Course not found", 404))
    }
    const review = course.reviews.find((item: any) => item._id === reviewId)
    if(!review) {
      return next(new ErrorHandler("Course not found", 404))
    }
    const data: any = {
      user: req.user,
      comment
    }
    review.commentReplies?.push(data)
    await course.save()
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}


