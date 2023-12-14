const express=require("express");
const loginRoute = express();
const bodyParser = require("body-parser");
const session = require ("express-session");
const config = require("../config/config");

loginRoute.use(session({secret:config.sessionSecret}));
loginRoute.use(bodyParser.json());
loginRoute.use(bodyParser.urlencoded({extended:true}));
/////

const auth =require("../middleware/auth");
/////// multer
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,path.join(__dirname,'../public/adminimage'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);


    }
});


const adminimageupload = multer({storage:storage});
loginRoute.use(express.static('public'));
/////////
loginRoute.set('view engine','ejs');
loginRoute.set('views','./views');

 /////// is line me thoda dikkat hai
// loginRoute.set('users','./email-verified');
const loginController = require("../controllers/loginController");

loginRoute.get('/registerlogin',auth.isLogin,loginController.loadadminregister);
loginRoute.post('/registeradmin',adminimageupload.single('image'),loginController.insertAdmindetails);
loginRoute.get('/verify',loginController.verifyMail);
loginRoute.get('/',auth.isLogout,loginController.loginLoad);
loginRoute.get('/login',auth.isLogout,loginController.loginLoad);
loginRoute.post('/login',loginController.verifyLogin);
loginRoute.get('/index',auth.isLogin,loginController.loadIndex);

loginRoute.get('/logout',auth.isLogin,loginController.userLogout);
loginRoute.get('/forget',auth.isLogout,loginController.forgetLoad);
loginRoute.post('/forget',loginController.forgetVerify);
loginRoute.get('/forget-password',auth.isLogout,loginController.forgetPasswordload);
loginRoute.post('/forget-password',loginController.resetPassword);
loginRoute.get('/verification',loginController.verificationLoad);
loginRoute.post('/verification',loginController.sendverificationLink);




module.exports = loginRoute;   /// or module.exports = {productRoute} as a object also can pass if more or one route