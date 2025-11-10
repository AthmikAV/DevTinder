const validator = require("validator");

const Validation = (req) =>{
    const {firstName, lastName,email,password} = req.body;
    if(!validator.isEmail(email)){
        throw new Error ("Email is not Valid");
    }
    if (!validator.isStrongPassword(password)){
        throw new Error("Password is not Valid")
    }
};


module.exports = Validation;