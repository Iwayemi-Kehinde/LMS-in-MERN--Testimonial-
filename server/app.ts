require("dotenv").config()
import express, {Request, Response, NextFunction} from "express"
import cors from "cors"
import userRouter from "./routes/user.route"
export const app = express()
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))
app.use(express.json())

app.use("/api/v1", userRouter)


app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  })
})


app.use((err:any, req:Request, res:Response, next:NextFunction) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"
  res.status(err.statusCode).json({
    success: false,
    message: err.message
  })
  next()
})