import express from "express"
import { createOrder, getAllOrder } from "../controllers/order.controller"
import { authorizeRole, isAuthenticated } from "../middleware/auth"
const orderRouter = express.Router()

orderRouter.post("/create-order", isAuthenticated, createOrder)

orderRouter.get("all-order", isAuthenticated, authorizeRole("admin"), getAllOrder)


export default orderRouter