const ConnectionRequest = require('../models/connectionRequest');
const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const userAuth = require("../middlewares/userAuth")

requestRouter.post("/request/:status/:userId",userAuth,async(req,res)=>{
    try{
        const allowedStatus = ["ignore","interest"];
        const userStatus = req.params.status;
        const toUserId = req.params.userId;
        const fromUserId = req.user._id;
        if(!allowedStatus.includes(userStatus)){
            return res.status(404).json({
                message : "status is not allowed"
            })
        }

        const toUser =await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({
                message : "User not found"
            })
        }

        const falseRequestUser = await ConnectionRequest.findOne({
  $or: [
    { fromUserId: fromUserId, toUserId: toUserId },
    { fromUserId: toUserId, toUserId: fromUserId }
  ]
});

        if(fromUserId.equals(toUserId)){
            return res.status(404).json({
                message : "You are sending request to yourself"
            })
        }

        if(falseRequestUser){
            return res.status(404).json({
                message : "Request already made"
            })
        }

        const Conection = new ConnectionRequest({
            fromUserId,
            toUserId,
            status:userStatus
        });

        await Conection.save();

        res.status(200).json({message : "connection is sent"});


        
    }
    catch(err){
        res.status(500).json({
            message: "ERROR: " + err
        })
    }
})


module.exports = requestRouter;
