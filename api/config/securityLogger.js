import {createLogger, transports, format} from 'winston'
import expressWinston from 'express-winston'
import winstonMongodb from 'winston-mongodb'  
import dotenv from 'dotenv' 



dotenv.config();
const uri =  "mongodb://localhost:27017/testapp?ssl=false&directConnection=true";



export const securityLogger = expressWinston.logger({
  transports : [
   
    new transports.MongoDB({
      db : uri,
      dbName : 'testapp',
      options: { useUnifiedTopology: true },
      collection: 'securityLogs',
      format:  format.combine( 
        format.timestamp(),
        format.json(),
        format.metadata(),
        format.prettyPrint()
        ) 
    })
  ],
  //requestWhitelist: ['body'],  CANNOT LOG USERS VALID CREDENTIALS
  responseWhitelist: ['body']
  
 
})