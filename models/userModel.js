
const mongoose = require('mongoose');


const loginuserSchema=new mongoose.Schema({
  
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    mobile: {type: Number, unique: true, required: true},
    image:{type:String,require:true},
    password: {type: String},
    is_verified:{type:Number,default:0},
    token: {type: String,default:''},
  
    
})
const User = mongoose.model('users',loginuserSchema);
module.exports=User;