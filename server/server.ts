require("dotenv").config()
import {app} from "./app"
import http from "http"
import { connectDB } from "./utils/db"
const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  console.log(`Server is connected to PORT ${process.env.PORT}`)
  connectDB()
}) 