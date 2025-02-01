require("dotenv").config()
import express, {Request, Response, NextFunction} from "express"
import cors from "cors"
export const app = express()
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  })
})