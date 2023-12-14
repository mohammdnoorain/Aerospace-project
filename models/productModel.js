const mongoose = require('mongoose');

const detailsSchema=new mongoose.Schema({
    productname: {type: String, required: true},
    sellingp: {type: String, required: true},
    originalp: {type: String, required: true},
    image:{type:String,require:true},
    discountpercentage: {type: String, required: true},
    description: {type: String, required: true},
 
    companydescription: {type: String, required: true},
    companyaddress: {type: String, required: true},
    contactseller: {type: String, required: true},
    producttype: {type: String, required: true},
    productsku: {type: String, required: true},
    productmfg: {type: String, required: true},
    productstock: {type: String, required: true},
    tag: {type: String, required: true},

  
    
})


const Details = mongoose.model('products-details',detailsSchema);

module.exports= Details;

