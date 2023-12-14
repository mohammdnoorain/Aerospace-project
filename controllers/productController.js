const res = require("express/lib/response");
const Products = require("../models/productModel")
const config= require("../config/config");
const bcrypt = require('bcrypt')
// const mongoose = require('mongoose');
// const ObjectId = mongoose.Types.ObjectId;



const loadRegister =async(req,res)=>{
    try{
        res.render('registerproducts')
    }catch (error){
        console.log(error.message)
    }
}

const insertProduct = async(req,res)=>{

    try{
     
        const products =new Products({

            productname:req.body.pname,
       
            sellingp:req.body.sellingp,
      
            originalp:req.body.originalp,
       
            image:req.file.filename,
        discountpercentage:req.body.discountp,
        
            description:req.body.pdescription,
        companydescription:req.body.cdescription,
            companyaddress:req.body.caddress,
        
            contactseller:req.body.scontact,
       
            producttype:req.body.ptype,
       
            productsku:req.body.pnumber,
        
            productmfg:req.body.pmfg,
        
            productstock:req.body.pstock,
       
            tag:req.body.ptag,
       
    



        });
       const result = await products.save();
       if(result){
        res.render('registerproducts',{message:"registration success"});
       }
       else{
        res.render('registerproducts',{message:"registration failed"});
       }
     


    }catch (error){
        res.send(error.message);
    }
}

///////////// search page//////

const loadSearchpage  =async(req,res)=>{
    try{
    
   const userData = await Products.find({});

        res.render('search',{users:userData})
    }catch (error){
        console.log(error.message)
    }
}

const loadHomepage = async(req,res)=>{
    try{
    
//    const userData = await Products.find({});

        res.render('home')
    }catch (error){
        console.log(error.message)
    }
}


const loadcartpage =async(req,res)=>{
    try{
  
        let productsku=req.body.productsku;
        const userData= await Products.findOne({productsku:productsku});
   console.log("here is the noorain",userData);

        res.render('cart',{users:userData})
    }catch (error){
        console.log(error.message)
    }
} 




const loadcheckoutpage = async(req,res)=>{
    try{
        let productsku=req.body.productsku;
        const userData= await Products.findOne({productsku:productsku});
   console.log("here is the",userData);

        res.render('checkout',{users:userData})
    }catch (error){
        console.log(error.message)
    }
}
////////end//////////



/////////// product show page//
const loadProductdetailpage=async(req,res)=>{
    try{
       
        const userData= await Products.find({});
      
        console.log(userData)
             
              res.render('product-details',{users:userData});

       
     
    }catch(error){
        console.log(error.message);
    }

}
////end/////////



///// delete admin details///

const deleteProduct =async(req,res)=>{
    try{
        let productnumber=req.body.productnumber;
        const userData= await Products.deleteOne({productsku:productnumber});
      
               console.log(userData)
             
              res.redirect('product-details');


       
     
    }catch(error){
        console.log(error.message);
    }

}

//////end/////



const loadProductpage= async(req,res)=>{
    try{
      
        const userData= await Products.find({});
      
               console.log(userData)
             
              res.render('product-details',{users:userData});


       
     
    }catch(error){
        console.log(error.message);
    }

}



////update product details///


const updateProductdetails =async(req,res)=>{
    try{
      let productnumber=req.body.productnumber;
        const userData= await Products.findOne({productsku:productnumber});
      
             
             
              res.render('edit-product',{users:userData});


       
     
    }catch(error){
        console.log(error.message);
    }

}



const loadProductupdatedpage = async(req,res)=>{
    try{
        let {pname,sellingp,originalp,image,discountp,pdescription,cdescription,caddress,scontact,ptype,pnumber,pmfg,pstock,ptag}=req.body;
    
        let data=await Products.updateOne(
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
    
    
        res.redirect('/product-details');

       
     
    }catch(error){
        console.log(error.message);
    }

}

////////end///



/// 

const loadProduct = async(req,res)=>{
    try{
        let productsku=req.body.productsku;
        const userData= await Products.findOne({productsku:productsku});
        const userData2 = await Products.find({});
        // console.log("here is the",userData);
        // console.log("here is the",userData2);

   

        res.render('product-left-thumbnail',{users:userData,trendinguser:userData2})


       
     
    }catch(error){
        console.log(error.message);
    }

}
const loadShoppage = async(req,res)=>{
    try{
    
      
        
                res.render('sell')
            }catch (error){
                console.log(error.message)
            }

}

 const  loadfilterProduct = async(req,res)=>{


    try{
        let productname=req.body.productname;
        const userData= await Products.find({productname:productname});
        // const userData2 = await Products.find({});
        // console.log("here is the",userData);
        // console.log("here is the",userData2);
        
console.log(userData)
   

        res.render('search',{users:userData})


       
     
    }catch(error){
        console.log(error.message);
    }

}






module.exports={
    loadRegister,
    insertProduct,
    loadSearchpage,
    loadcartpage,
    loadcheckoutpage ,
    loadProductdetailpage,
    deleteProduct,
    loadProductpage,
    updateProductdetails,
    loadProductupdatedpage,
    loadProduct,
    loadfilterProduct,
    loadHomepage,
    loadShoppage


}