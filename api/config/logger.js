import {createLogger, transports, format} from 'winston'
import expressWinston from 'express-winston'
import winstonMongodb from 'winston-mongodb'  
import dotenv from 'dotenv' 

dotenv.config();

const uri = process.env.MONGO_DB 

export const logger = expressWinston.logger({

  transports : [

    new transports.MongoDB({
      db : uri,
      dbName : 'testapp',
      options: { useUnifiedTopology: true },
      collection: 'allLogs',
      format:  format.combine( 
        format.timestamp(),
        format.json(),
        format.metadata(),
        format.prettyPrint()
        ) 
    })
  ],
  requestWhitelist: ['body'],
  responseWhitelist: ['body']
  
})  

/*
export const errorLogger = expressWinston.errorLogger({
  transports : [
   
    new transports.MongoDB({
      level: "error", 
      db : uri,
      dbName : 'seconddemoapp',
      options: { useUnifiedTopology: true },
      collection: 'errorLogs',
      format:  format.combine( 
        format.timestamp(),
        format.json(),
        format.metadata(),
        format.prettyPrint()
        ) 
    })
  ],
  requestWhitelist: ['body'],
  responseWhitelist: ['body']
})
 */