const express = require('express');
const connectDB = require('../config/database');
const User = require("../models/user");
const Validation = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator =require('validator');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');



const app = express();



app.use(express.json());
app.use(cookieParser());



app.post('/signup',async (req,res)=>{
    const {firstName,lastName,email,password,age,gender,photoUrl,skills} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    const user = new User({
        firstName,
        lastName,
        email,
        password : hashedPassword,
        age,
        gender,
        photoUrl,
        skills
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
})

app.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    try{
        if (!validator.isEmail(email)){
            throw new Error ("Email is not Valid");
        }

        const user =await User.findOne({email:email});
        if (!user){
            throw new Error ("Invalid Credential");
        }

        const isPasswordValid =await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            throw new Error("Invalid Credential");
        }
        
        const token = await jwt.sign({_id:user.id},"DivTinder@123");
        res.cookie("token",token);
        res.status(200).json({
            success:true,
            message:"Logged Succesfully"
        })
    
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"ERROR : " + err.message
        })
    }
})

app.get('/profile', async (req,res)=>{
    try{
        const cookies = req.cookies;
        console.log(cookies);
        const {token} = cookies; 
        if (!token){
            throw new Error ("Token not Found");
        }
        const decodedmsg = jwt.verify(token,"DivTinder@123");
        const _id = decodedmsg._id;
        const user = await User.findById(_id);
        if (!user){
            throw new Error ("User Not found");
        }
        else{
            res.status(200).send({
                success:true,
                user
            })
        }
        
    }catch(err){
        res.status(500).send({
            success:false,
            message:"Error: " + err
        })
    }

    
})

app.get('/user', async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).send("User Not Found!");
        }
        else{
           res.send(user); 
        }
    }
    catch(err){
        res.status(500).send('Something got Failed')
    }
}) 

app.get('/feed', async (req,res)=>{
    try{
        const users = await User.find({});
        if (users.length === 0){
            res.status(404).send("No User Found!")
        }
        else{
            res.send(users);
        }
    } catch(err){
        res.status(500).send('Something got Failed')
    }
})

app.delete('/user',async (req,res)=>{
    try{
        const user = await User.findOneAndDelete({_id : req.body.id});
        if (!user){
            res.status(404).send("No User Found!");
        }
        else{
          res.status(200).json({
            message:"User is Deleted",
            deletedUser: user
          });  
        }
        
    } catch(err){
        res.status(500).send('Something got Failed')
    }}
);

app.patch('/user/:userId', async (req,res) =>{
    const userId = req.params?.userId;
    const data = req.body;
    try{
        const allowedUpdates = ["firstName","lastName","age","gender"];
        const isUpdateAllowed = Object.keys(data).every((item)=>{
            return allowedUpdates.includes(item);
        });

        if(!isUpdateAllowed){
            throw new Error("Update Email is not Allowed");
        }

        if (data.skills.length > 10){
            throw new Error("Skills cannot be more then 10")
        }
        const user = await User.findByIdAndUpdate(userId,{firstName:"Athmik",lastName:"AV"},{new:true});
        res.status(200).json({
            message:"Succesfully Updated"
        })
    }
    catch(err){
        res.status(500).json({
            message: "Somethis Went Wrong"
        })
    }
})


connectDB()
  .then(() => {
    console.log("Connection is established");
    app.listen(3500, () => {
      console.log("Server is running on port 3500");
    });
  })
  .catch((err) => {
    console.error("Database is not connected:", err.message);
  });
