import express from "express"
import { activateUser, registrationUser } from "../controllers/user.controller"
const userRouter = express.Router()

userRouter.post("/register", registrationUser)
userRouter.post("/activateUser", activateUser)

export default userRouter