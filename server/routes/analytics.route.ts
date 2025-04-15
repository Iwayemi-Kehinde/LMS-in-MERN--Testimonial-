import express from "express"
import { authorizeRole, isAuthenticated } from "../middleware/auth"
import { getOrderAnalytics, getUserAnalytics, getCourseAnalytics } from "../controllers/analytics.controller"

const analyicsRouter = express.Router()

analyicsRouter.get("/get-users-analytics", isAuthenticated, authorizeRole("admin"), getUserAnalytics)


analyicsRouter.get("/get-order-analytics", isAuthenticated, authorizeRole("admin"), getOrderAnalytics)

analyicsRouter.get("/get-course-analytics", isAuthenticated, authorizeRole("admin"), getCourseAnalytics)


export default analyicsRouter