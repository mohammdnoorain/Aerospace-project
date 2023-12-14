//import express from 'express';
const express = require('express')
//import mongoose from 'mongoose';
const mongoose = require('mongoose')
//import ejs from 'ejs';
const ejs = require('ejs')
//import  bodyParser  from 'body-parser';
const bodyParser = require('body-parser');
const products = require("./controllers/productController");

//import session from 'express-session';
const session = require('express-session')
//import cors from 'cors';
const bcrypt = require('bcrypt')
const mongoDbSession = require ('connect-mongodb-session')(session);
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')



//////////


const path = require('path');


const multer = require('multer');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,path.join(__dirname,'/public/productimage'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);


    }
});
const upload = multer({storage:storage});

////////////////

const App=express();
App.set('view engine','ejs');
App.set('views','./views');
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));

App.use(express.static('public'));
App.use(flash());
App.use(cookieParser('StringforSecretKey'));
App.use(express.static('public'));





mongoose.connect('mongodb+srv://noorainmohammad908:sss798@cluster0.bhos1yh.mongodb.net/cart').then(()=>{
    //here collegedb is the name of database in Mongodb
    //If this is not created from MongoDb it will be created here      
    console.log('MongoDB is connected');


});
App.use(session({
    secret:'this is my top secret',
    cookie: {maxAge: 60000},
    resave:false,
    saveUninitialized:false,
    // store: store,

}))
/// define routes
const productRoute = require("./routes/productRoute");
App.use('/',productRoute);
const loginRoute = require("./routes/loginRoute");
App.use('/',loginRoute);
const adminRoute = require("./routes/adminRoute");
App.use('/',adminRoute);
const userRoute = require("./routes/userRoute");
App.use('/',userRoute);

App.get('/search',async(req,res)=>{
     
    let data=await Details.find({});
    console.log(data);
    res.render('search',{users: data});
   
   
})




App.post('/delete',async(req,res)=>{
    let email=req.body.email;
    let data=await Students.deleteOne({
        email: email
  })
  res.redirect('/all-users2')
})




App.post('/edit',async(req,res)=>{
    let email=req.body.email;
    
    let data=await Students.findOne({email: email});
    console.log(data);
    res.render('edit',{users: data});
})

App.post('/update',async(req,res)=>{
    let {roll,name,email,course}=req.body;
    
    let data=await Students.updateOne(
        {
          email: email
        },
        {
            $set: 
            {   
                roll:roll,
                name: name,
                email: email,
                course:course
            }
        }
    )
    res.redirect('/all-users2');
})


// this delete and update for user.ejs page

App.post('/delete2',async(req,res)=>{
    let email=req.body.email;
    let data=await Students.deleteOne({
        email: email
  })
  res.redirect('/users')
})




App.post('/edit2',async(req,res)=>{
    let email=req.body.email;
    
    let data=await Students.findOne({email: email});
    console.log(data);
    res.render('edit',{users: data});
})

App.post('/update',upload.single('image'),async(req,res)=>{
    let {roll,name,email,image,course}=req.body;
    
    let data=await Students.updateOne(
        {
          email: email
        },
        {
            $set: 
            {   
                roll:roll,
                name: name,
                email: email,
                course:course,
                image:req.file.filename
            }
        }
    )
    res.redirect('/users');
})
// ////////////////////////////////////


App.get('/all-users',async(req,res)=>{
    let data=await Students.find({});
    console.log(data);
   res.render('filter-user',{users: data});

   // res.render('filter-user');
})
App.get('/all-users2',async(req,res)=>{
    let data=await Students.find({});
    console.log(data);
   res.render('filter-user2',{users: data});

   // res.render('filter-user');
})
App.get('/all-users3',async(req,res)=>{
    let data=await Students.find({});
    console.log(data);
   res.render('filter-user3',{users: data});

   // res.render('filter-user');
})
App.get('/all',async(req,res)=>{
   
    let data=await Students.find({});
    console.log(data);
    res.render('users',{users: data});
})





App.post('/filter-data',async(req,res)=>{
    let email=req.body.email;
    
    let data=await Students.find({email: email});
    console.log(data);
    res.render('filter-user',{users: data});
})
App.post('/filter-data2',async(req,res)=>{
    let email=req.body.email;
    let name=req.body.name;
    
    let data=await Students.find(({$or:[{name:{$eq:name}},{email:{$eq:email}}]}));
    console.log(data);
    res.render('filter-user2',{users: data});
})
///////////////

App.get('/admin-details',async(req,res)=>{
    let data=await Login.find({});
    console.log(data);
   res.render('admin-details',{users: data});

 
})








///////////// product show
// App.get('/products-all',async(req,res)=>{
//     let data=await Details.find({});
//     console.log(data);
//    res.render('products',{users: data});

// })


App.post('/filter-products',async(req,res)=>{
    let name=req.body.pname;
    let number=req.body.pnumber;
    
    let data=await Details.find(({$or:[{productname:{$eq:name}},{productsku:{$eq:number}}]}));
    console.log(data);
    res.render('products',{users: data});
})



App.post('/delete-product',async(req,res)=>{
    let pnumber=req.body.productnumber;
    let data=await Details.deleteOne({
        productsku: pnumber
  })
  res.redirect('/products')
})




App.post('/edit-product',async(req,res)=>{
    let pnumber=req.body.productnumber;
    
    let data=await Details.findOne({productsku: pnumber});
    console.log(data);
    res.render('productedit',{users: data});
})

App.post('/update-product',upload.single('image'),async(req,res)=>{
    let {pname,sellingp,originalp,image,discountp,pdescription,cdescription,caddress,scontact,ptype,pnumber,pmfg,pstock,ptag}=req.body;
    
    let data=await Details.updateOne(
        {
         productsku: pnumber
        },
        {
            $set: 
            {   
               
            productname:pname,
       
            sellingp:sellingp,
      
            originalp:originalp,
       
            image:req.file.filename,
            discountpercentage:discountp,
            description:pdescription,
            companydescription:cdescription,
            companyaddress:caddress,
        
            contactseller:scontact,
       
            producttype:ptype,
       
            productsku:pnumber,
        
            productmfg:pmfg,
        
            productstock:pstock,
            tag:ptag,
            }
        }
    )
    res.redirect('/products');
})

/////////////
App.listen(3016,()=>{
    console.log('Server is Running');
 })