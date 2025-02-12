require("dotenv").config()
import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from "jsonwebtoken"
import userModel, { IUser } from '../models/user.model'
import { ErrorHandler } from '../utils/ErrorHandler'
import sendActivationMail from '../utils/sendMail'
import { sendToken } from '../utils/sendToken'


interface RegistrationBody {
  name: string,
  email: string,
  password: string,
  avatar?: string
}

export const registrationUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body as RegistrationBody
  const isExist = await userModel.findOne({ email })
  if (isExist) {
    return next(new ErrorHandler("Email already exists", 400))
  }
  const user: RegistrationBody = {
    name,
    email,
    password
  }

  const activationToken = createActivationToken(user)
  const data = { user: { name: user.name, email: user.email, activationToken: activationToken.activationCode } }
  try {
    await sendActivationMail(data.user.name, data.user.email, data.user.activationToken)
    res.status(200).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account!`,
      activationToken: activationToken.activationToken,
    })
  } catch (error: any) {
    return next(new ErrorHandler(500, error.message))
  }
}

interface IActivationToken {
  activationCode: string;
  activationToken: string
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString()
  const activationToken = jwt.sign({ user, activationCode }, process.env.ACCESS_TOKEN as Secret, { expiresIn: "10m" })
  return { activationCode, activationToken }
}


interface IActivationRequest {
  activationCode: string,
  activationToken: string
}
export const activateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { activationCode, activationToken } = req.body as IActivationRequest
  const newUser = jwt.verify(activationToken, process.env.ACCESS_TOKEN as Secret) as { activationCode: string, user: IUser }
  if (newUser.activationCode !== activationCode) {
    return next(new ErrorHandler("Invalid OTP", 400))
  }
  const { name, email, password } = newUser.user
  const user = await userModel.create({
    name,
    email,
    password
  })
  res.status(200).json({
    message: "User created sucessfully",
    user
  })
}


interface ILoginRequest {
  email: string;
  password: string
}

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginRequest
    if (!email || !password) {
      return next(new ErrorHandler("Fill in all fields", 400))
    }
    const user = await userModel.findOne({ email }).select("password")
    if (!user) {
      return next(new ErrorHandler("Account does not exist", 404))
    }
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Password incorrect", 500))
    }
    sendToken(user, 200, res)
  } catch (err: any) {
    return next(new ErrorHandler(err.message, 500))
  }
}