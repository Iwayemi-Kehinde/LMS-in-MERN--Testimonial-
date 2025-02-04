require("dotenv").config()
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export interface IUser extends Document {
  name: string,
  email: string,
  password: string,
  avatar: {
    public_id: string;
    url: string;
  },
  role: string,
  isVerified: boolean,
  courses: Array<{ courseId: string }>,
  comparePassword: (password: string) => Promise<boolean>,
  signAccessToken: () => string,
  signRefreshToken: () => string,
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true
  },
  password: {
    type: String,
    minLength: [6, "Password must be minimum of 6 characters"],
    select: false
  },
  avatar: {
    public_id: String,
    url: String
  },
  role: {
    type: String,
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  courses: [
    {courseId: String}
  ]
}, {timestamps:true})

userSchema.pre<IUser>("save",  async function(next) {
  if(!this.isModified("password")) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
  next()
})


userSchema.methods.signRefreshToken = function() {
  return jwt.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET || "", {
    expiresIn: "3d"
  })
}


userSchema.methods.signAccessToken = function() {
  return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN_SECRET || "", {
    expiresIn: "5m"
  })
}


userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  const testedPassword = await bcrypt.compare(password, this.password)
  return testedPassword
}


const userModel: Model<IUser> = mongoose.model("User", userSchema)

export default userModel