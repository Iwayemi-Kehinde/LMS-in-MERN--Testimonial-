require("dotenv").config()
import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from "jsonwebtoken"
import userModel, { IUser } from '../models/user.model'
import { ErrorHandler } from '../utils/ErrorHandler'
import sendActivationMail from '../utils/sendMail'
import { sendToken } from '../utils/sendToken'
import { redis } from '../utils/redis'
import { CustomRequest } from '../middleware/auth'


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

export const LogoutUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    res.cookie("access_token", "")
    res.cookie("refresh_token", "")
    redis.del(req.user?._id || "")
    res.status(200).json({
      success: true,
      message: "Logout successful"
    })
  } catch (error: any) {
    return next(new ErrorHandler("Logout Failed", 500))
  }
}


export const updateAccessToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const refresh_token = req.cookies.refresh_token
    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN as Secret) as any
    const message = "could not refresh token"
    if (!decoded) {
      return next(new ErrorHandler(message, 400))
    }
    const session: any = await redis.get(decoded.id as string)
    const user = JSON.parse(session)
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN as Secret, {
      expiresIn: "5m"
    })

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN as Secret, {
      expiresIn: "3d",
    })

    req.user = user
    
    res.cookie("access_token", accessToken, {
      expires: new Date(Date.now() + 60000 * 5),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    })

    res.cookie("refresh_token", refreshToken, {
      expires: new Date(Date.now() + 60000 * 60 * 24 * 3),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    })

    await redis.set(user._id as any, JSON.stringify(user), "EX", 604800)

    next()
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 500))
  }
} 

