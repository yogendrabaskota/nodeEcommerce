import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../database/models/userModel";


export interface AuthRequest extends Request{
    user? :{
        username : String,
        email : String,
        role : String,
        password : String,
        id : String
    }
}


export enum Role{
    Admin = 'admin',
    Customer = 'customer'
}

class AuthMiddleware{
    async isAuthenticated(req:AuthRequest, res:Response, next:NextFunction):Promise<void>{

        const token = req.headers.authorization
        if(!token || token == undefined){
            res.status(403).json({
                message : "Please Login"
            })
            return
        }
        // verify token
         jwt.verify(token, process.env.SECRET_KEY as string,async(err,decoded:any)=>{
            if(err){
                res.status(403).json({
                    message : "Invalid Token"
                })

            }else{
              try {
                const userData = await User.findByPk(decoded.id)
                if(!userData){
                    res.status(404).json({
                        message : "No user with that token"
                    })
                    return
                }req.user = userData 
                next()

              } catch (error) {
                res.status(500).json({
                    message: "Something went wrong"
                })
                
              }
            }
            
         })
    }

    restrictTo(...roles:Role[]){
    return  (req:AuthRequest, res:Response, next:NextFunction)=>{
        let userRole = req?.user?.role as Role
        if(!roles.includes(userRole)){
            res.status(403).json({
                message:"You don't have permission"
            })
        }else{
            next()
        }

    }

    }
}

export default new AuthMiddleware()