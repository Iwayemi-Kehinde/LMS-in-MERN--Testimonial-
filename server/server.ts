require("dotenv").config()
import {app} from "./app"
import http from "http"
import {v2 as cloudinary} from "cloudinary"
import { connectDB } from "./utils/db"
const server = http.createServer(app)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY
})

server.listen(process.env.PORT, () => {
  console.log(`Server is connected to PORT ${process.env.PORT}`)
  connectDB()
})