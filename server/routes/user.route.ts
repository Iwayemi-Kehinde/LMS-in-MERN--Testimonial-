import express from "express"
import { activateUser, LoginUser, LogoutUser, registrationUser } from "../controllers/user.controller"
const userRouter = express.Router()

userRouter.post("/register", registrationUser)
userRouter.post("/login", LoginUser)
userRouter.get("/logout", LogoutUser)
userRouter.post("/activateUser", activateUser)

export default userRouter
