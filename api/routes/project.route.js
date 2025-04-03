import express from 'express'
import { getAllProjectsTest, getProjectById } from '../controllers/project.controller.js';
import { removeMemberFromProject } from '../controllers/project.controller.js';
import { addMemberToProject } from '../controllers/project.controller.js';
import { getProjectsByRole } from '../controllers/project.controller.js';
import { createProject, getAllProjects, editProject, deleteProject } from "../controllers/project.controller.js";
import { authMiddleware } from '../middleware/authmiddleware.js';

const router = express.Router();

router.post("/createProject", authMiddleware, createProject)
router.get("/getAllProjects", authMiddleware, getAllProjects)
router.get("/getAllProjectsTest", getAllProjectsTest)
router.post("/editProject", authMiddleware, editProject)
router.delete("/deleteProject/:id", authMiddleware, deleteProject)
router.get("/getProjectsByRole", authMiddleware, getProjectsByRole)
router.get("/getProjectById/:id", authMiddleware, getProjectById)
router.post("/addMemberToProject", authMiddleware, addMemberToProject)
router.post("/removeMemberFromProject", authMiddleware, removeMemberFromProject)





export default router; 