const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
   firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name must be at least 2 characters long"],
    maxlength: [50, "First name cannot exceed 50 characters"]
  },

  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    minlength: [1, "Last name must be at least 1 character long"],
    maxlength: [50, "Last name cannot exceed 50 characters"]
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"]
  },

  age: {
    type: Number,
    min: [10, "Age must be above 10"],
    max: [100, "Age cannot exceed 100"]
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender is required"]
  },
  photoUrl : {
    type : String,
    default:"https://www.pngitem.com/pimgs/m/661-6619328_default-avatar-png-blank-person-transparent-png.png"
  },
  skills:[String]
});

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = await jwt.sign({_id:user._id},"DivTinder@123");
  return token;
}

userSchema.methods.validatePassword = async function(userPassword){
  const user = this;
  const isPasswordValid = await bcrypt.compare(userPassword, user.password);
  return isPasswordValid;
}

const User = mongoose.model('User',userSchema);
module.exports = User;

