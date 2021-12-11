const mongoose = require("mongoose");
userSchema = mongoose.Schema({
    _id:Number,
    username:String,
    password:String,
    email:String,
    phone:Number
    
})

module.exports = mongoose.model('user',userSchema);