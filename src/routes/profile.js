const express = require("express");
const profileRouter  = express.Router();
const User = require("../models/user");
const userAuth = require("../middlewares/userAuth");
const {patchDataValidation, Validation} = require("../utils/validation");
const validator = require("validator");
const bcrypt = require('bcrypt');



profileRouter.get('/profile/view',userAuth, async (req,res)=>{
    try{
        const user = await User.findById(req.user._id);
        res.status(200).send(user)
    }catch(err){
        res.status(401).json({
            success:false,
            message: "ERROR : " + err.message,
        })
    }});

profileRouter.patch('/profile/edit',userAuth,async (req,res)=>{
    try{
        const editableData = req.body;
        const user = req.user
        const isValid = patchDataValidation(req)
        if(!isValid){
            throw new Error("Data is not Editable");
        }
        Object.keys(editableData).forEach((item)=>user[item] = editableData[item])
        await user.save()
        res.status(200).send(user)
    }catch(err){
        res.status(500).json({
            message:"ERROR: " + err
        })
    }
});

profileRouter.patch('/profile/forgot-password',userAuth, async (req,res) =>{
    try{
        const user = req.user;
        const newPasword = req.body.password;
        Validation(req);
        const email = req.body.email;
        const data = User.findOne({email:email});
        if(!data){
            throw new Error ("please login");
        }
        const hashedPassword = await bcrypt.hash(newPasword,10);
        user.password = hashedPassword
        await user.save();
        res.status(200).json({
            message:"Password as altered"
        });
    }catch(err){
        res.status(500).json({
            message:"Somthing went wrong"
        });
    }
})

module.exports = profileRouter;