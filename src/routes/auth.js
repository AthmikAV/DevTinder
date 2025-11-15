const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {Validation} = require("../utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post('/signup',async (req,res)=>{
    const {firstName,lastName,email,password,age,gender,photoUrl,skills,about} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        age,
        gender,
        photoUrl,
        skills,about
    });
    try{
        Validation(req);
        await user.save();
        res.status(200).json({
            success: true,
            message:"User is Added Succesfully"
        })
    }
    catch(err){
        res.status(404).send('Error: ' + err)
    } 
});



authRouter.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    try{
        if (!validator.isEmail(email)){
            throw new Error ("Email is not Valid");
        }

        const user =await User.findOne({email:email})
        if (!user){
            throw new Error ("Invalid Credential");
        }

        const isPasswordValid = await user.validatePassword(password);
        
        user.password = null;
        if (!isPasswordValid){
            throw new Error("Invalid Credential");
        }
        
        const token = await user.getJWT();
        res.cookie("token",token);
        res.status(200).json({
            success:true,
            message: "Logged Succesfully",
            data: user
        })
    
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"ERROR : " + err.message
        })
    }
});

authRouter.post('/logout',(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.status(200).send({
        success:true,
        message:"Logout was successful"
    })
});

module.exports = authRouter;