import express from 'express'
import { createUser, loginUser, logoutcurrentuser } from '../controllers/userController.js'

const router = express.Router()

router.route('/').post(createUser)
router.route('/auth').post(loginUser)
router.route('/logout').post(logoutcurrentuser)


export default router