import express from 'express'
import Task from  "../models/task.model.js";
import cloudinary from '../cloudinaryConfig.js'


export const createTask = async (req, res, next) => {

    try {
        console.log(req.body)
        const newTask = new Task(req.body)
        await newTask.save()
        res.status(201).json({"successMessage":"Task has been created succesfully."});
    } catch (error) {
        next(error)
    }
}

export const getAllTasks = async (req, res, next) => {

    try {
        
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] === "all") {
              delete req.body[key];
            }
          });
        const tasks = await Task.find(req.body).populate("assignedTo")
        .populate("assignedBy")
        .populate("project").sort({ createdAt: -1 });
        res.status(200)
          .send(tasks);
       
    } catch (error) {
        next(error)
    }
}

export const editTask = async (req, res, next) => {

    try {
        console.log(req.body)
        await Task.findByIdAndUpdate(req.body._id, req.body)
        res.status(201).json({"successMessage":"Task has been edited succesfully."});
    } catch (error) {
        next(error)
    }
}

export const editTaskStatus = async (req, res, next) => {

    try {
        console.log(req.body)
        const { _id } = req.body;

        // Find the task by ID
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).json({"successMessage": "Task not found" });
        }

        // Toggle the status
        task.status = task.status === "pending" ? "completed" : "pending";

        // Save the updated task
        await task.save();

        res.status(201).json({"successMessage":"Task has been edited succesfully."});
    } catch (error) {
        next(error)
    }
}

export const deleteTask = async (req, res, next) => {

    try {
        await Task.findByIdAndDelete(req.params.id)
        res.status(201).json({"successMessage":"Task has been deleted succesfully."});
    } catch (error) {
        next(error)
    }
}


export const uploadImage = async (req, res, next) => {

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "tasks",
          });
          const imageURL = result.secure_url;
      
          await Task.findOneAndUpdate(
            { _id: req.body.taskId },
            {
              $push: {
                attachments: imageURL,
              },
            }
          );
          res.status(200)
          .send(imageURL);
    } catch (error) {
        next(error)
    }
}  