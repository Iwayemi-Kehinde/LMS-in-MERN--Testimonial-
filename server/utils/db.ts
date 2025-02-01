import mongoose from "mongoose" 
require("dotenv").config({})

const dbUrl = process.env.MONOGO_URI || "mongodb://localhost:27017/lms"

export const connectDB = async () => {
  try {
    const data = await mongoose.connect(dbUrl)
    console.log(`Database connected successfully ${data.connection.host}`)
  } catch (error: any) {
    console.log(error.message)
    setTimeout(connectDB, 5000000)
  }
}