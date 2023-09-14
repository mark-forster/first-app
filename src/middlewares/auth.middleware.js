const jwt= require('jsonwebtoken');
const User= require('../models/user.model')
const logger= require('../config/logger')
// protected routes token base

const isAuth= async (req,res,next) =>{
   try{
    const token= req.headers.authorization;
    if(token){
        jwt.verify(token,process.env.JWT_KEY,(err, decoded)=>{
            if (err) return res.json({status: err.statusCode, message: "Authentication failed, Login First"});
            else{
            req.user= decoded;
            next()
            }
            return (req.user);
        })
    }
    else{
       return res.status(403).json({status: 403, message: "Authentication failed"});
    }
   }
   catch(err){
    logger.error(err)
   }
}


module.exports={
    isAuth
}