const User = require("../models/user");
const jwt = require('jsonwebtoken');


const userAuth = async (req,res,next)=>{
    try{const {token} = req.cookies;
    if (!token){
        throw new Error ("Token not found");
    }

    const decodedmsg = jwt.verify(token,"DivTinder@123");
    const {_id} = decodedmsg;

    const user = await User.findById(_id);

    if(!user){
        throw new Error ("User not found");
    }
    req.user = user;
    next();}
    catch(err){
        res.status(500).json({
            success: false,
            message:"ERROR: " + err
        })
    }
};

module.exports = userAuth;