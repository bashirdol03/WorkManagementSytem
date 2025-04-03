import express from 'express'
import { listSessions, removeUserSessions, removeSessionById } from '../controllers/session.controller.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();


router.get("/listSessions", authMiddleware, verifyAdmin, listSessions)
router.post("/removeUserSessions", authMiddleware, verifyAdmin, removeUserSessions)
router.post("/removeSessionById", authMiddleware, verifyAdmin, removeSessionById)

export default router; 