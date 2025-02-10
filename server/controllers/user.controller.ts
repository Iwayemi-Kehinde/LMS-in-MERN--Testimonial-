require("dotenv").config()
import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from "jsonwebtoken"
import userModel from '../models/user.model'
import { ErrorHandler } from '../utils/ErrorHandler'
import sendActivationMail from '../utils/sendMail'


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