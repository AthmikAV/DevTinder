const validator = require("validator");

const Validation = (req) =>{
    const {email,password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error ("Email is not Valid");
    }
    if (!validator.isStrongPassword(password)){
        throw new Error("Password is not Valid")
    }
};



const patchDataValidation = (req) =>{
    const data = req.body;
    const allowedFeilds = ["firstName","lastName", "age", "gender","photoUrl",  "skills"]
    const validEditableData = Object.keys(data).every((key)=>allowedFeilds.includes(key));
    return validEditableData;
};



module.exports = {Validation,patchDataValidation};