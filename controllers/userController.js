const res = require("express/lib/response");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const randomstring= require("randomstring")

const config= require("../config/config");




const loadUserregister =async(req,res)=>{
    try{
        res.render('registeruser')
    }catch (error){
        console.log(error.message)
    }
}

///mail verify for registration//





const sendverifyMail = async(name,email,user_id)=>{
    try{
      const transporter=    nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                // pass:'hbqj lkmp nlon iihf',
                pass:config.emailPassword,
            }
          });
        const mailOption ={
            from:config.emailUser,
            to:email,
            subject:'for verification mail',
            html:'<p> hii '+name+' , please cli9ck here to <a href="http://localhost:3016/verify?id='+user_id+'">verify </a> your mail.</p>'
        }
        transporter.sendMail( mailOption,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log(" email has been send:-",info.response);
            }
        })



    }catch (error){
        console.log(error.message)

    }
}




const verifyMail = async(req,res)=>{
    try{
      
       const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}});
       console.log(updateInfo);
       res.render("email-verified");



    }catch(error){
        console.log(error.message);

    }
}

///// end///


const insertUserdetails=async(req,res)=>{

    try{
     
        const passwordHash = await bcrypt.hash(req.body.password,10);
        const registeruser =new User({

            name: req.body.name,
          email:req.body. email,
          mobile:req.body.mobile,
           image:req.file.filename,
              password: passwordHash,
              is_verified:0

    



        });
       const output = await registeruser.save();
       if(output){
        sendverifyMail(req.body.name,req.body.email,output._id);
       

        res.render('registeruser',{message:"registration user success please verify your mail"});
       }
       else{
        res.render('registeruser',{message:"registration user failed"});
       }


    }catch (error){
   
        res.send(error.message);
    }
}

////login///
 const userloginLoad = async(req,res)=>{
    try{
        res.render('userlogin');
    }catch(error){
        console.log(error.message);
    }

}


const verifyLoginuser =  async(req,res)=>{
    try{

        const email= req.body.email;
        const password=req.body.password;
      
      const userData=await User.findOne({email:email});
      if(userData){
          
        const passwordMatch= await bcrypt.compare(password,userData.password);
     if(passwordMatch){
if(userData.is_verified === 0){

 res.render('userlogin',{message:"please verify your mail"});     
}else{
    req.session.user_id= userData._id;
    // console.log(userData);
    // console.log(userData._id);
      res.redirect('/search');
}
     }
        else{
            res.render('userlogin',{message:"Email and Password is incorrect"});     
      }
        
    }
    else{
     res.render('userlogin',{message:"Email and Password is incorrect"});
    }
      



    }catch(error){
        console.log(error.message);

    }
}


const loadhome= async(req,res)=>{
    try{

       const userData= await User.findById({_id:req.session.user_id});///////// important line for id search and data out
        res.render('search',{users:userData});
    }catch(error){
        console.log(error.message);
    }

}


const userLogout= async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(error){
        console.log(error.message);
    }

}

module.exports={
    loadUserregister,
    insertUserdetails,
    verifyMail,
    userloginLoad,
    verifyLoginuser,
    loadhome,
    userLogout
    
}