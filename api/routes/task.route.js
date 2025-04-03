import express from 'express'
import { createTask, deleteTask, editTask, editTaskStatus, getAllTasks, uploadImage } from '../controllers/task.controller.js';
import { authMiddleware } from '../middleware/authmiddleware.js';
import multer from 'multer';

const router = express.Router();

// create multer storage
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    },
  });

router.post("/createTask", authMiddleware, createTask)
router.post("/getAllTasks", authMiddleware, getAllTasks)
router.post("/editTask", authMiddleware, editTask)
router.post("/editTaskStatus", authMiddleware, editTaskStatus)
router.delete("/deleteTask/:id", authMiddleware, deleteTask)
router.post("/uploadImage", authMiddleware, multer({ storage: storage }).single("file"), uploadImage)



export default router; 