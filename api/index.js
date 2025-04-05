import express from 'express'
import mongoose from 'mongoose';
import userRoute from './routes/user.route.js'
import sessionRoute from './routes/session.route.js'
import logRoute from './routes/log.route.js'
import projectRoute from './routes/project.route.js'
import taskRoute from './routes/task.route.js'

import { logger } from './config/logger.js'
import { securityLogger } from './config/securityLogger.js'

import session from 'express-session'
import MongoStore from 'connect-mongo'
import dotenv from 'dotenv'
import cors from 'cors'


dotenv.config()

const app = express()

const PORT = process.env.PORT || 8078;

// Middleware to parse JSON
app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";
const frontendUri = process.env.FRONTEND_URL;

app.use(cors({
  origin: isProduction
    ? frontendUri 
    : "http://localhost:3000",
  credentials: true
}));


// SESSION SETUP AND PERSISTING SESSION DATA IN MONGO-DB

// const url = process.env.MONGO

// MongoDB connection URI
const mongoUri = process.env.MONGO_DB 

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

const sessionSecret = process.env.SESSION_SECRET

// Configure the session store
const sessionStore = MongoStore.create({
  mongoUrl: mongoUri, // Directly provide the MongoDB connection URI
  collectionName: "sessions",
  touchAfter: 24 * 60 * 60, // Time in seconds (24 hours)
});

app.use(session({
    name: "session",
    secret : sessionSecret,
    resave : false,
    saveUninitialized : false,
    store : sessionStore,
    // DONT SET ANY COOKIE OPTIONS HERE, STOPS SESSION DATA PERSISTING
    cookie : {secure :  isProduction , // SET TO FALSE TO RUN TESTS (HTTP SESSION COOKIE PERSISTENCE)
              // COMMENT OUT SAMESITE,DOMAIN AND PATH FOR TESTS 
              sameSite : isProduction ? "none" : "lax",
              // domain: '.localhost', // ALL LOCAL HOST SUBDOMAINS
              //path: '/api', // CAN USE IT FOR DIFFERENT VVERSIONS OF APP
              // COULD HAVE TWO APP.JS LIKE FILES WITH SLIGHT DIFFERENCES IN ROUTES
              // AND MIDDLEWARES
              // httpOnly : true,
              maxAge: 2 * 60 * 60 * 1000 // EXPIRES IN 2 HOURS , TIME IN MILLISECONDS
            } // MUST BE FALSE TO WORK AS IM USING HTTP CONNECTION
          
  })) 



app.use("/api/users", securityLogger, userRoute); 
app.use("/api/projects", logger, projectRoute);
app.use("/api/tasks", logger, taskRoute);



/*

Hiding the admin features while app is deployed
app.use("/api/sessions" , logger, sessionRoute); 
app.use("/api/logs", logger, logRoute); 
*/

// Test route
/*
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Express API!" });
});

// Simple Mongoose schema and model for testing
const TestSchema = new mongoose.Schema({
    name: String,
  });
  
  const TestModel = mongoose.model("Test", TestSchema);
  
  // API route to test MongoDB
  app.get("/test-dbb", async (req, res) => {
    try {
      // Insert a test document
      const testDoc = new TestModel({ name: "MongoDB Test Document 4" });
      await testDoc.save();
  
      // Retrieve all documents
      const docs = await TestModel.find();
  
      res.json({ message: "MongoDB is working!", data: docs });
    } catch (error) {
      console.error("Error interacting with MongoDB:", error);
      res.status(500).json({ message: "Error interacting with MongoDB", error });
    }
  });  

  */


  app.use( logger, (err, req, res, next) => {
    console.log(err)
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
     
    return res.status(errorStatus).json({"errorMessage": errorMessage});
    
  });
    

// Start the server
app.listen(PORT, async () => {
    await connect(),
    console.log(`Server is running on port ${PORT}`);
});