import createError from "../utils/createError.js"
import dotenv from 'dotenv'

dotenv.config()

const adminEmail = process.env.ADMIN_EMAIL


export const verifyAdmin = async (req, res, next) => {
    
    // WILL CHECK IF THE ROLE IS ADMIN,

    if(req.email !== adminEmail )
    return next(createError(403,` you are not authorised, only the admin can proceed `))
    
     
    next()


}