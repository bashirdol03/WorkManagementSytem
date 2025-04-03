import express from 'express'
import Project from  "../models/project.model.js";
import User from "../models/user.model.js";
import createError from '../utils/createError.js';

export const createProject = async (req, res, next) => {

    try {
        const newProject = new Project(req.body)
        await newProject.save()
        res.status(201).json({"successMessage":"Project has been created succesfully."});
    } catch (error) {
        next(error)
    }
}

export const getAllProjects = async (req, res, next) => {

    try {
        const projects = await Project.find({owner:req.userId}).sort({ createdAt: -1 });
        res.status(200)
          .send(projects);
       
    } catch (error) {
        next(error)
    }
}

export const getAllProjectsTest = async (req, res, next) => {

    try {
        //const projects = await Project.find({owner:req.userId}).sort({ createdAt: -1 });
        console.log('function reached')
        res.status(201).json({"successMessage":"Project has been deleted succesfully."});
       
    } catch (error) {
        next(error)
    }
}

export const getProjectsByRole = async (req, res, next) => {

    try {
        const userId = req.userId
        const projects = await Project.find({"members.user":userId}).sort({ createdAt: -1 }).populate('owner');
        res.status(200)
          .send(projects);
       
    } catch (error) {
        next(error)
    }
}

export const getProjectById = async (req, res, next) => {

    try {
        const project = await Project.findById(req.params.id).sort({ createdAt: -1 }).populate('owner').populate('members.user');
        res.status(200)
          .send(project);
       
    } catch (error) {
        next(error)
    }
}

export const editProject = async (req, res, next) => {

    try {
        await Project.findByIdAndUpdate(req.body._id, req.body)
        res.status(201).json({"successMessage":"Project has been edited succesfully."});
    } catch (error) {
        next(error)
    }
}

export const deleteProject = async (req, res, next) => {

    try {
        await Project.findByIdAndDelete(req.params.id)
        res.status(201).json({"successMessage":"Project has been deleted succesfully."});
    } catch (error) {
        next(error)
    }
}

export const addMemberToProject = async (req, res, next) => {

    try {
        console.log(req.body)
        const { email, role, projectId } = req.body;
        const user = await User.findOne({ email });
        if (!user) return next(createError(401, "user not found"));
        
        const project = await Project.findById(projectId);
        if (!project) return next(createError(404, "Project not found"));

        if (project.owner.toString() !== req.userId) {
            return next(createError(403, "You are not authorized to modify this project"));
        }

        await Project.findByIdAndUpdate(projectId, {
        $push: {
            members: {
            user: user._id,
            role,
            },
        },
    });
        res.status(201).json({"successMessage":"member added succesfully."});
    } catch (error) {
        next(error)
    }
}

export const removeMemberFromProject = async (req, res, next) => {

    try {
        console.log(req.body)
        const { memberId, projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) return next(createError(404, "Project not found"));

        if (project.owner.toString() !== req.userId) {
            return next(createError(403, "You are not authorized to modify this project"));
        }
        project.members.pull(memberId);
        await project.save();
        res.status(201).json({"successMessage":"member removed succesfully."});
    } catch (error) {
        next(error)
    }
}
