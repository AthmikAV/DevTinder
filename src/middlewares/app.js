const express = require('express');
const connectDB = require('../config/database');
const User = require("../models/user");


const app = express();

app.use(express.json());

app.post('/signup',async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("✅ User added successfully"); 
    }
    catch(err){
        res.status(404).send('Something got Failed')
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


connectDB().then(()=>{
    console.log('connection is established');
    app.listen(3500,()=>{
    console.log("server is created");
});
}).catch((err)=>{
    console.log("Database is not connected");
})

