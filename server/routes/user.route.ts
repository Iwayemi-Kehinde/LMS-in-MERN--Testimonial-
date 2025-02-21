import express from "express"
import { activateUser, getAllUsers, getUserInfo, LoginUser, LogoutUser, registrationUser, updatePassword, updateProfilePicture, updateUserInfo } from "../controllers/user.controller"
import { authorizedRoles, isAuthenticated } from "../middleware/auth"
const userRouter = express.Router()

userRouter.post("/register", registrationUser)
userRouter.post("/login", LoginUser)
userRouter.get("/logout", isAuthenticated as any, LogoutUser as any)
userRouter.post("/activateUser", activateUser)
userRouter.get("/me", isAuthenticated as any, getUserInfo as any)
userRouter.put("/update-user-info", isAuthenticated as any, updateUserInfo as any)
userRouter.put("/update-user-password", isAuthenticated as any, updatePassword as any)
userRouter.put("/update-user-avatar", isAuthenticated as any, updateProfilePicture as any)
userRouter.get("/get-users", isAuthenticated as any, authorizedRoles("admin") as any, getAllUsers as any)


export default userRouter
