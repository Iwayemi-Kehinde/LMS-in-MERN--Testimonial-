require("dotenv").config()
import express, {Request, Response, NextFunction} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route"
import { ErrorHandler } from "./utils/ErrorHandler"
export const app = express()

//body parser
app.use(express.json({limit: "50mb"}))

//cors => cross orgin resource sharing
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true
}))

//cookie parser
app.use(cookieParser())

// API test
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working!"
  })
})

//user router
app.use("/api/v1", userRouter)

//unknown route
app.all("*", (req:Request, res:Response, next:NextFunction) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404))
})

//error middleware
app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
})