const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/userAuth");
const User = require('../models/user');
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get('/user/request/received',userAuth,async (req,res) =>{
    try{
        const loggedInUser = req.user;

        const receivedData = await ConnectionRequest.find({
            status : "interest",
            toUserId:loggedInUser._id
        }).populate("fromUserId",['firstName','lastName','age','gender','photoUrl']);

        res.status(200).json({message :"Recived Request",
            data :(receivedData)});

    }
    catch(err){
        res.status(404).json({
            message:"ERROR: "+err
        })
    }
});


userRouter.get('/user/request/connections',userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connectionsData = await ConnectionRequest.find({
            $or : [
                {toUserId : loggedInUser._id , status : "accept"},
                {fromUserId: loggedInUser._id, status:"accept"}
            ]
        }).populate("fromUserId", ['firstName','lastName','age','gender','photoUrl']).populate("toUserId", ['firstName','lastName','age','gender','photoUrl']);


        const data = connectionsData.map((item) => {
        if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
            return item.toUserId;
        } else {
        return item.fromUserId; 
        }
});

        res.status(200).json({
            message : "connections requests",
            data 
        })
    }
    catch(err){
        res.status(500).json({
            message: "ERROR: " + err
        })
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;

    // Get all connection requests involving logged in user
    const connectionData = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select('fromUserId toUserId');

    // Build a set of user IDs to exclude from feed
    const hideDataForFeed = new Set();
    connectionData.forEach(el => {
      hideDataForFeed.add(el.fromUserId.toString());
      hideDataForFeed.add(el.toUserId.toString());
    });

    // Exclude logged-in user and all users already connected / interacted
    const feedData = await User.find({
      _id: { $nin: Array.from(hideDataForFeed), $ne: loggedInUser._id }
    })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed data fetched successfully",
      data: feedData
    });
  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err.message });
  }
});


module.exports = userRouter;