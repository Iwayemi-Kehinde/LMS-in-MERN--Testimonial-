require("dotenv").config({})
import { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "../utils/ErrorHandler"
import userModel from "../models/user.model"
import jwt from "jsonwebtoken"
import nodemailer, { Transporter } from "nodemailer"

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

