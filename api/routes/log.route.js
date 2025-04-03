import express from 'express'
import { listLogs, listSecurityLogs } from '../controllers/log.controller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();


router.get("/listSecurityLogs", authMiddleware, verifyAdmin, listSecurityLogs)
router.get("/listLogs", authMiddleware, verifyAdmin,listLogs)

export default router; 