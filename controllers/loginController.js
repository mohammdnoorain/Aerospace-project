const res = require("express/lib/response");
const Registeradmin = require("../models/loginModel")
const bcrypt = require('bcrypt')
const nodemailer = require("nodemailer");

const randomstring= require("randomstring")
const config= require("../config/config");







///// for send mail ///
const sendverifyMail = async(name,email,user_id)=>{
    try{
      const transporter   =    nodemailer.createTransport({
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
            subject:'for ve3rification mail',
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



///// end///
////// admion register ands load page ///////
const loadadminregister =async(req,res)=>{
    try{
        res.render('registerlogin')
    }catch (error){
        console.log(error.message)
    }
}

const insertAdmindetails = async(req,res)=>{

    try{
     
        const passwordHash = await bcrypt.hash(req.body.password,10);
        const registeradmin =new Registeradmin({

            name: req.body.name,
          email:req.body. email,
           image:req.file.filename,
              password: passwordHash,
              is_verified:0

    



        });
       const output = await registeradmin.save();
       if(output){
        sendverifyMail(req.body.name,req.body.email,output._id);

        res.render('registerlogin',{message:"registration admin success please verify your mail"});
       }
       else{
        res.render('registerlogin',{message:"registration admin failed"});
       }


    }catch (error){
   
        res.send(error.message);
    }
}

const verifyMail = async(req,res)=>{
    try{
      
       const updateInfo =await Registeradmin.updateOne({_id:req.query.id},{$set:{is_verified:1}});
       console.log(updateInfo._id);
       res.render("email-verified");



    }catch(error){
        console.log(error.message);

    }
}
//// for login pa///

const loginLoad= async(req,res)=>{
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);
    }

}
const verifyLogin = async(req,res)=>{
    try{

        const email= req.body.email;
        const password=req.body.password;
      
      const userData=await Registeradmin.findOne({email:email});
      if(userData){
          
        const passwordMatch= await bcrypt.compare(password,userData.password);
     if(passwordMatch){
if(userData.is_verified === 0){

 res.render('login',{message:"please verify your mail"});     
}else{
    req.session.user_id= userData._id;
    // console.log(userData);
    // console.log(userData._id);
      res.redirect('/index');
}
     }
        else{
            res.render('login',{message:"Email and Password is incorrect"});     
      }
        
    }
    else{
     res.render('login',{message:"Email and Password is incorrect"});
    }
      



    }catch(error){
        console.log(error.message);

    }
}

////login end
  /// for index page//

const loadIndex= async(req,res)=>{
    try{

       const userData= await Registeradmin.findById({_id:req.session.user_id});///////// important line for id search and data out
        res.render('index',{user:userData});
    }catch(error){
        console.log(error.message);
    }

}
//////login end//////
/// logout//
const userLogout= async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/');
    }catch(error){
        console.log(error.message);
    }

}

///// logout end///

/////////// forget ////////////

const forgetLoad
= async(req,res)=>{
    try{
     res.render('forget');
    }catch(error){
        console.log(error.message);
    }

}

const forgetVerify = async(req,res)=>{
    try{
      
      const email = req.body.email;

      const userData =await Registeradmin.findOne({email:email});
         if(userData){
            
         
           if(userData.is_verified === 0){
            res.render('forget',{message:"please verify your mailt"});
           }else{
            const randomString = randomstring.generate();
        const updateData  =  await Registeradmin.updateOne({email:email},{$set:{token:randomString}});
        sendresetpasswordMail(userData.name,userData.email,randomString);
        res.render('forget',{message:"please check your mail to reset your password"});
    }
         }else{
            res.render('forget',{message:"user email is incorrect"});
         }


       }catch(error){
           console.log(error.message);
       }
}
///////////////////////////////////////////end ///////////////



/////////////// for reset password send mail///////

const sendresetpasswordMail = async(name,email,token)=>{
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
            subject:'for reset password',
            html:'<p> hii '+name+' , please click here to <a href="http://localhost:3012/forget-password?token='+token+'">Reset </a> your PASSWORD.</p>'
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


 const forgetPasswordload = async(req,res)=>{
    try{

        const token = req.query.token;
       const tokenData = await Registeradmin.findOne({token:token});
       console.log("this is",tokenData);
       if(tokenData){
        res.render('forget-password',{user_id:tokenData._id});//////////// impoertant

       }else{
        res.render('404',{message:"token is invalid"});
       }
 
    }catch(error){
        console.log(error.message);
    }

}





const resetPassword =async(req,res)=>{
    try{

        const password = req.body.password;
        const user_id = req.body.user_id;

        const passwordHash = await bcrypt.hash(password,10);
       const updateData= await Registeradmin.findByIdAndUpdate({_id:user_id},{$set:{password: passwordHash,token:''}});
      console.log("this is",updateData);
        res.redirect("/");

     
    }catch(error){
        console.log(error.message);
    }

}




/////////////////////end///////

///////// verification send link if user verify later ////

const verificationLoad=async(req,res)=>{
    try{

        res.render('verification');

     
    }catch(error){
        console.log(error.message);
    }

}

const sendverificationLink= async(req,res)=>{
    try{

        const email = req.body.email;
      
       const userData= await Registeradmin.findOne({email:email});
      
       if(userData){

        sendverifyMail(userData.name,userData.email,userData._id);
        res.render('verification',{message:" reset verification email is send on your  mail please check "});

       }else{
        res.render('verification',{message:"email is invalid"});
       }
 
     
    }catch(error){
        console.log(error.message);
    }

}

///////////////




module.exports={
    insertAdmindetails,
    loadadminregister,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadIndex,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordload,
    resetPassword,
    verificationLoad,
    sendverificationLink,
    

}