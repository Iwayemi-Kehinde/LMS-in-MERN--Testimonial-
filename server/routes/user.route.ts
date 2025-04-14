import express from "express"
import { activateUser, deleteUser, getAllUser, getUserInfo, loginUser, logoutUser, RegisterUser, socialAuth, updateAccessToken, updateProfilePicture, updateUserInfo, updateUserPasssword, updateUserRole } from "../controllers/user.controller"
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
userRouter.get("/all-user", isAuthenticated, authorizeRole("admin"), getAllUser)
userRouter.post("/update-user", isAuthenticated, authorizeRole("admin"), updateUserRole)
userRouter.delete("/delete-user/:id", isAuthenticated, authorizeRole("admin"), deleteUser)

export default userRouter 