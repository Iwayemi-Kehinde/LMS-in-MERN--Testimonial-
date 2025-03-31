import express from "express"
import { activateUser, RegisterUser } from "../controllers/user.controller"

const userRouter = express.Router()

userRouter.post("/registerUser", RegisterUser)
userRouter.post("/activateUser", activateUser)

export default userRouter