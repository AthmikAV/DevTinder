const ConnectionRequest = require('../models/connectionRequest');
const express = require("express");
const requestRouter = express.Router();
const User = require("../models/user");
const userAuth = require("../middlewares/userAuth")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const allowedStatus = ["ignore", "interest"];
    const userStatus = req.params.status;
    const toUserId = req.params.toUserId;
    const fromUserId = req.user._id;

    if (!allowedStatus.includes(userStatus)) {
      return res.status(400).json({ message: "Invalid status type" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "You cannot send a request to yourself" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId }
      ]
    });

    if (existingRequest) {
      return res.status(409).json({ message: "Connection request already exists" });
    }

    const connection = new ConnectionRequest({
      fromUserId,
      toUserId,
      status: userStatus
    });

    await connection.save();

    res.status(200).json({ message: "Connection request sent" });

  } catch (err) {
    res.status(500).json({ message: "ERROR: " + err });
  }
});


requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const allowedStatus = ['accept','reject'];
        const {status,requestId} = req.params;
        const logedInUser = req.user._id;
        if(!allowedStatus.includes(status)){
            return res.status(404).json({
                message:"Status not allowed"
            })
        }

        const verifyConnection =await ConnectionRequest.findOne({
            _id : requestId,
            status : 'interest',
            toUserId:logedInUser
        });

        if(!verifyConnection){
            return res.status(404).json({
                message:"Connection request not found"
            })
        }

        verifyConnection.status = status;

        await verifyConnection.save();

        res.send("request added")

    }
    catch(err){
        res.status(500).json({
            message : "ERROR: " + err
        })
    }
});


module.exports = requestRouter;
