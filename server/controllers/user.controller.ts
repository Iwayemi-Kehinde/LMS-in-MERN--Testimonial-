require("dotenv").config({})
import { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "../utils/ErrorHandler"
import userModel from "../models/user.model"
import jwt from "jsonwebtoken"
import nodemailer, { Transporter } from "nodemailer"
import { redis } from "../utils/redis"

interface IRegistrationBody {
  name: string,
  email: string,
  password: string
}

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body as IRegistrationBody
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required", 400))
    }
    const isEmailExist = await userModel.findOne({ email })
    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist!", 400))
    }
    const user: IRegistrationBody = {
      name,
      email,
      password
    }
    const { token, activationCode } = createActivationCode(user)
    const transport: Transporter = nodemailer.createTransport({
      service: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    })
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your Verification Code",
        html: `<h3>Your OTP code: <b>${activationCode}</b></h3>`,
      }
      await transport.sendMail(mailOptions)
      res.status(200).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account!`,
        activationToken: token
      })
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500))
    }
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

interface IActivationCode {
  token: string,
  activationCode: string
}

export const createActivationCode = (user: { name: string, email: string, password: string }): IActivationCode => {
  const activationCode = Math.floor(Math.random() * 9000).toString()
  const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as string)
  return { token, activationCode }
}

interface IActivateUser {
  activation_token: string,
  activation_code: string
}

export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activation_token, activation_code } = req.body as IActivateUser
    const user = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string) as { activationCode: string, user: { name: string, email: string, password: string } }

    if (user.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid Activation Code", 400))
    }
    const isEmailExist = await userModel.findOne({ email: user.user.email })

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exists", 400))
    }

    const newUser = await userModel.create({
      name: user.user.name,
      email: user.user.email,
      password: user.user.password
    })
    res.status(201).json({
      success: true,
      message: `Register successful`,
      user: newUser
    })
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
}

interface ILoginUser {
  email: string,
  password: string
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginUser
    if (!email || !password) {
      return next(new ErrorHandler("All fields are required", 400))
    }
    const user = await userModel.findOne({ email }).select("+password") as any
    if (!user) {
      return next(new ErrorHandler("Email does not exist", 404))
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
      return next(new ErrorHandler("Password Incorrect", 400))
    }
    const accessToken = user.signAccessToken()
    const refreshToken = user.signRefreshToken()

    res.cookie("access_token", accessToken, {
      expires: new Date(Date.now() + 5 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    res.cookie("refresh_token", refreshToken, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    })

    redis.set(user._id, JSON.stringify(user))

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken: accessToken,
      user: user
    })

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }

}