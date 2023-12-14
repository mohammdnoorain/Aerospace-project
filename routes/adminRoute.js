const express=require("express");
const adminRoute = express();
const bodyParser = require("body-parser");
const session = require ("express-session");
const config = require("../config/config");

adminRoute.use(session({secret:config.sessionSecret}));
adminRoute.use(bodyParser.json());
adminRoute.use(bodyParser.urlencoded({extended:true}));
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
adminRoute.use(express.static('public'));
/////////
adminRoute.set('view engine','ejs');
adminRoute.set('views','./views');

 /////// is line me thoda dikkat hai
// adminRoute.set('users','./email-verified');
const adminController = require("../controllers/adminController"); ////this line connect controler to routes


/// admin details show page ///
adminRoute.get('/admin-details',auth.isLogin,adminimageupload.single('image'),adminController.loadAdmindetailpage);
//end///
////// delete admin details///
adminRoute.post('/delete-admin',auth.isLogin,adminController.deleteAdmin);
adminRoute.get('/admin-details',auth.isLogin,adminController.loadAdminpage);
adminRoute.post('/edit-admin',auth.isLogin,adminController.updateAdmindetails);


///from edit.ejs to admincontroller///////
adminRoute.post('/update-admindetails',adminimageupload.single('image'),adminController.loadAdminupdatedpage);
/////end///

module.exports = adminRoute;   /// or module.exports = {productRoute} as a object also can pass if more or one route