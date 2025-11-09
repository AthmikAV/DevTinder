const mongoose = require("mongoose");
const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://DevTinder:MyStrongPassdevtinder@devtinder.stmnnmd.mongodb.net/?appName=DevTinder");
}
module.exports = connectDB;
