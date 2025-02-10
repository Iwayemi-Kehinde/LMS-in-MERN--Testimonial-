import mongoose from "mongoose" 
require("dotenv").config({})

// const dbUrl = process.env.MONOGO_URI || "mongodb://localhost:27017/lms"

export const connectDB = async () => {
  try {
    const data = await mongoose.connect('mongodb://127.0.0.1:27017/lms')
    console.log(`Database connected to ${data.connection.host} successfully`)
  } catch (error: any) {
    console.log(error)
    setTimeout(connectDB, 5000)
  }
}