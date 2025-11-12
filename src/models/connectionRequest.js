const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
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