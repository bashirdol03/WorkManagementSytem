import express from 'express'
import mongoose from 'mongoose'
import createError from '../utils/createError.js';

export const listSessions = async (req, res, next) => {

    try {
        const sessionsCollection = mongoose.connection.collection('sessions');
        const allSessions = await sessionsCollection.find().toArray();
        
        // Check if the sessions array is empty
        if (allSessions.length === 0) {
            return res.status(404).json({
            message: 'There are no active user sessions.',
            });
        }

        // If sessions exist, return them with a 200 status
        return res.status(200).json({
            message: 'Successfully fetched sessions.',
            data: allSessions
        });
        } catch (error) {
        next(error)
    }
}



export const removeUserSessions = async (req, res, next) => {

    const { userId } = req.body;  // Get userId from the request body
  
    if (!userId) {
      return res.status(400).json({ message: "userId is required in the request body" });
    }
  
    try {
      const sessionsCollection = mongoose.connection.collection('sessions');
      
      // Delete all sessions for the user with the given userId
      const result = await sessionsCollection.deleteMany({
        'session': { $regex: `"user":{"_id":"${userId}"` }
      });
      
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: `No active sessions found for user with ID: ${userId}`
        });
      }
  
      return res.status(200).json({
        message: `All sessions for user with ID ${userId} have been logged out successfully.`
      });
    } catch (error) {
        next(error)
    }
}




export const removeSessionById = async (req, res, next) => {

    const { sessionId } = req.body;  // Get sessionId from the request body
  
    if (!sessionId) {
      return res.status(400).json({ message: "sessionId is required in the request body" });
    }
  
    try {
      const sessionsCollection = mongoose.connection.collection('sessions');
      
      // Delete the session by its unique session ID
      const result = await sessionsCollection.deleteOne({
        _id: sessionId // Convert sessionId to an ObjectId
      });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: `No session found with ID: ${sessionId}`
        });
      }
  
      return res.status(200).json({
        message: `Session with ID ${sessionId} has been logged out successfully.`
      });
    } 
     catch (error) {
        next(error)
    }
}



  

 
  