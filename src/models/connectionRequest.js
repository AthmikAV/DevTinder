const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status : {
        type:String,
        enum:{
            values:["ignore","interest","accept","reject"],
            message:"{VALUE} is incorrect"
        }
    }
},{
    timestamps:true
});

const ConnectionRequest = new mongoose.model("ConnectionRequest",ConnectionRequestSchema);

module.exports = ConnectionRequest;