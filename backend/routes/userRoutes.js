import express from 'express'
import { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile } from '../controllers/userController.js'
import {authenticate, authorizeAdmin} from "../middlewares/authMiddleware.js"
import { authRateLimiter } from "../middlewares/rateLimiter.js"

const router = express.Router()

router.route('/').post(authRateLimiter, createUser).get(authenticate, authorizeAdmin, getAllUsers)
router.route('/auth').post(authRateLimiter, loginUser)
router.route('/logout').post(logoutCurrentUser)
router.route('/profile').get(authenticate, getCurrentUserProfile).put(authenticate, updateCurrentUserProfile)

export default router
