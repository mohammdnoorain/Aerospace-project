const express=require("express");
const productRoute = express();
const bodyParser = require("body-parser");
const session = require ("express-session");
const config = require("../config/config");
productRoute.use(bodyParser.json());
productRoute.use(bodyParser.urlencoded({extended:true}));


productRoute.use(session({secret:config.sessionSecret}));

/////

const auth =require("../middleware/auth");



///// multer

const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination:function(req,file,cb){
    cb(null,path.join(__dirname,'../public/productimage'));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);


    }
});


const imageupload = multer({storage:storage});
/////
productRoute.set('view engine','ejs');
productRoute.set('views','./views');
const productController = require("../controllers/productController");
productRoute.get('/registerproducts',productController.loadRegister);
productRoute.post('/registerproducts',imageupload.single('image'),productController.insertProduct);
productRoute.get('/search',productController.loadSearchpage);
productRoute.get('/home',productController.loadHomepage);
productRoute.get('/shop',productController.loadShoppage);


// productRoute.get('/checkout',productController.loadcheckoutpage);
productRoute.post('/checkout-load',productController.loadcheckoutpage);

// productRoute.post('/search',,productController.loadSearchdata);


/// product details show page ///
productRoute.get('/product-details',auth.isLogin,imageupload.single('image'),productController.loadProductdetailpage);
//end///
////// delete product details///
productRoute.post('/delete-product',auth.isLogin,productController.deleteProduct);
productRoute.get('/product-details',auth.isLogin,productController.loadProductpage);
productRoute.post('/edit-product',auth.isLogin,productController.updateProductdetails);


///from edit.ejs to admincontroller///////
productRoute.post('/update-productdetails',imageupload.single('image'),productController.loadProductupdatedpage);
/////end///


///// load product detail to next page /// 
productRoute.post('/load-product',productController.loadProduct);
productRoute.post('/filter-data',productController.loadfilterProduct);
///end///
productRoute.post('/cart-load',productController.loadcartpage);


module.exports = productRoute;   /// or module.exports = {productRoute} as a object also can pass if more or one route