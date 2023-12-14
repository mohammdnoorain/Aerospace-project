const express=require("express");
const userRoute = express();
const bodyParser = require("body-parser");
const session = require ("express-session");
const config = require("../config/config");

userRoute.use(session({secret:config.sessionSecret}));
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({extended:true}));
/////

const auth =require("../middleware/userauth");
/////// multer
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,path.join(__dirname,'../public/userimage'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);


    }
});


const adminimageupload = multer({storage:storage});
userRoute.use(express.static('public'));
/////////
userRoute.set('view engine','ejs');
userRoute.set('views','./views');

 /////// is line me thoda dikkat hai
// userRoute.set('users','./email-verified');
const userController = require("../controllers/userController");
userRoute.get('/registeruser',auth.isLogout,userController.loadUserregister);
userRoute.post('/registeruserdata',adminimageupload.single('image'),userController.insertUserdetails);
/// mail verify for registration//
userRoute.get('/verify',userController.verifyMail);
///login user///
userRoute.get('/',auth.isLogout,userController.userloginLoad);
userRoute.get('/userlogin',auth.isLogout,userController.userloginLoad);
userRoute.post('/userlogin',userController.verifyLoginuser);
userRoute.get('/search',auth.isLogin,userController.loadhome);
///end///
userRoute.get('/logout',auth.isLogin,userController.userLogout);


module.exports = userRoute;