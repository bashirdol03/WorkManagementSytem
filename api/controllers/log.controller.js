import express from 'express'
import mongoose from 'mongoose'
import createError from '../utils/createError.js';

export const listLogs = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const logsCollection = mongoose.connection.collection('allLogs');
      const allLogs = await logsCollection
        .find()
        .skip((page - 1) * limit)  // Skip the appropriate number of logs for pagination
        .limit(Number(limit))      // Limit the number of logs returned
        .toArray();
  
      if (allLogs.length === 0) {
        return res.status(404).json({
          message: 'There are no logs available.',
        });
      }
  
      return res.status(200).json({
        message: 'Successfully fetched logs.',
        data: allLogs,
        pagination: {
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  };



export const listSecurityLogs = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
  
    try {
      const logsCollection = mongoose.connection.collection('securityLogs'); 
      const allLogs = await logsCollection
        .find()
        .skip((page - 1) * limit)  // Skip the appropriate number of logs for pagination
        .limit(Number(limit))      // Limit the number of logs returned
        .toArray();
  
      if (allLogs.length === 0) {
        return res.status(404).json({
          message: 'There are no logs available.',
        });
      }
  
      return res.status(200).json({
        message: 'Successfully fetched logs.',
        data: allLogs,
        pagination: {
          currentPage: page,
          pageSize: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  };
    
