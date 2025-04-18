import express from "express"
import { authorizeRole, isAuthenticated } from "../middleware/auth"
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller"

const LayoutRouter = express.Router()

LayoutRouter.post("/create-layout", isAuthenticated, authorizeRole("admin"), createLayout)

LayoutRouter.post("/edit-layout", isAuthenticated, authorizeRole("admin"), editLayout)

LayoutRouter.get("/get-layout", isAuthenticated, authorizeRole("admin"), getLayoutByType)

export default LayoutRouter