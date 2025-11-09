const express = require('express');
const connectDB = require('../config/database');
const User = require("../models/user");


const app = express();

app.post('/signup',async (req,res)=>{
    const user = new User({
        firstName:"babith",
        lastName:"ps",
        email:"babith@gmail.com",
        password:"babith@421",
        age:18,
        gender:"male"
    });
    try{
       await user.save();
        res.send("✅ User added successfully"); 
    }
    catch(err){
        res.status(400).send("Error in adding User");
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

