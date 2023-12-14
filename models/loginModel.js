
const mongoose = require('mongoose');


const loginSchema=new mongoose.Schema({
  
    name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    image:{type:String,require:true},
    password: {type: String},
    is_admin:{type:Number,default:0},
    is_verified:{type:Number,default:0},
    token: {type: String,default:''},
  
    
})
const Login = mongoose.model('admins',loginSchema);
module.exports=Login;