import express from 'express'
import { authorizeRole, isAuthenticated } from '../middleware/auth'
import { getNotifications } from '../controllers/notification.controller'

const notificationRouter = express.Router()

notificationRouter.get("/get-all-notifications", isAuthenticated, authorizeRole("admin"), getNotifications)

export default notificationRouter