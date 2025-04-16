import express from "express"
import { isAuthenticated } from "../middleware/auth"
import { createLayout } from "../controllers/layout.controller"

const LayoutRouter = express.Router()

LayoutRouter.post("/create-layout", isAuthenticated, createLayout)


export default LayoutRouter