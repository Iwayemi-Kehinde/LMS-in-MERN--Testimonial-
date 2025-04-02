import express from "express"
import { activateUser, getUserInfo, loginUser, logoutUser, RegisterUser, socialAuth, updateAccessToken, updateProfilePicture, updateUserInfo, updateUserPasssword } from "../controllers/user.controller"
import { authorizeRole, isAuthenticated } from "../middleware/auth"

const userRouter = express.Router()

userRouter.post("/registerUser", RegisterUser)
userRouter.post("/activateUser", activateUser)
userRouter.post("/loginUser", loginUser)
userRouter.get("/logoutUser", isAuthenticated, logoutUser)
userRouter.get("/refreshToken", updateAccessToken)
userRouter.get("/me", isAuthenticated, getUserInfo)
userRouter.post("/socialAuth", socialAuth)
userRouter.put("/updateUserInfo", isAuthenticated, updateUserInfo)
userRouter.post("/update-user-password", isAuthenticated, updateUserPasssword)
userRouter.post("/update-user-avatar", isAuthenticated, updateProfilePicture)

export default userRouter 