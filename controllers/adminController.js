const res = require("express/lib/response");
const Registeradmin = require("../models/loginModel");
const bcrypt = require('bcrypt');
const config= require("../config/config");



const loadAdmindetailpage=async(req,res)=>{
    try{
       
        const userData= await Registeradmin.find({});
      
        console.log(userData)
             
              res.render('admin-details',{users:userData});

       
     
    }catch(error){
        console.log(error.message);
    }

}
////end/////////



///// delete admin details///

const deleteAdmin =async(req,res)=>{
    try{
        let email=req.body.email;
        const userData= await Registeradmin.deleteOne({email:email});
      
               console.log(userData)
             
              res.redirect('admin-details');


       
     
    }catch(error){
        console.log(error.message);
    }

}

//////end/////



const loadAdminpage= async(req,res)=>{
    try{
      
        const userData= await Registeradmin.find({});
      
               console.log(userData)
             
              res.render('admin-details',{users:userData});


       
     
    }catch(error){
        console.log(error.message);
    }

}



////update admin details///


const updateAdmindetails =async(req,res)=>{
    try{
      let email=req.body.email;
        const userData= await Registeradmin.findOne({email:email});
      
             
             
              res.render('edit',{users:userData});


       
     
    }catch(error){
        console.log(error.message);
    }

}



const loadAdminupdatedpage = async(req,res)=>{
    try{
        let {name,email,image}=req.body;
    
        let data=await Registeradmin.updateOne(
            {
             email: email
            },
            {
                $set: 
                {   
                   
               name:name,
               email:email,
                image:req.file.filename,
           
                }
            }
        )
        res.redirect('/admin-details');

       
     
    }catch(error){
        console.log(error.message);
    }

}
///end///
module.exports={
    loadAdmindetailpage,
    deleteAdmin,
    loadAdminpage,
    updateAdmindetails,
    loadAdminupdatedpage

}