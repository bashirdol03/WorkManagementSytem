import express from 'express'
import { getLoggedInUser, listAllUsers, login, loginWithGoogle, logout, register } from "../controllers/user.controller.js";
import { authMiddleware } from '../middleware/authmiddleware.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';


const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/loginWithGoogle", loginWithGoogle)
router.get("/getLoggedInUser", authMiddleware, getLoggedInUser)
router.get("/listAllUsers", authMiddleware, verifyAdmin, listAllUsers)

export default router; 