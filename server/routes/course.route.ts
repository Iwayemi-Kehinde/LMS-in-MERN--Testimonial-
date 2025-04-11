import express from "express"
import { addAnswer, addQuestion, addReplyToReview, addReview, createCourse, editCourse, getAllCourse, getCourseByUser, getSingleCourse } from "../controllers/course.controller"
import { authorizeRole, isAuthenticated } from "../middleware/auth"
const courseRouter = express.Router()

courseRouter.post("/create-course", isAuthenticated, authorizeRole("admin"), createCourse)

courseRouter.put("/edit-course/:id", isAuthenticated, authorizeRole("admin"), editCourse)

courseRouter.get("/getCourse/:id", getSingleCourse)

courseRouter.get("/getCourses", getAllCourse)

courseRouter.get("/get-course-content/:id", isAuthenticated, getCourseByUser)

courseRouter.put("/add-question/:id", isAuthenticated, addQuestion) 

courseRouter.put("/add-answer", isAuthenticated, addAnswer)

courseRouter.put("/add-review/:id", isAuthenticated, addReview)

courseRouter.post("/add-replytoreview", isAuthenticated, addReplyToReview)


export default courseRouter