import mongoose from "mongoose" 
require("dotenv").config({})

const dbUrl: string = process.env.MONOGO_URI || ""

export const connectDB = async () => {
  try {
    const data = await mongoose.connect(dbUrl)
    console.log(`Database connected to ${data.connection.host} successfully!`)
  } catch (error: any) {
    console.log("Error connecting to MongoDB: " + error.message)
    setTimeout(connectDB, 5000)
  }
}