import express from "express"
import { activateUser, LoginUser, LogoutUser, registrationUser } from "../controllers/user.controller"
import { isAuthenticated } from "../middleware/auth"
const userRouter = express.Router()

userRouter.post("/register", registrationUser)
userRouter.post("/login", LoginUser)
userRouter.get("/logout", isAuthenticated as any, LogoutUser as any)
userRouter.post("/activateUser", activateUser)

export default userRouter
