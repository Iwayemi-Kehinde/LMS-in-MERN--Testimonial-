import express from "express"
import { RegisterUser } from "../controllers/user.controller"

const userRouter = express.Router()

userRouter.post("/registerUser", RegisterUser)

export default userRouter