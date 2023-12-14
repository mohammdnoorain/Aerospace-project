const isLogin=async(req,res,next)=>{
    try{

      if(req.session.user_id){

      }else{
        res.redirect('registeruser');
      }
      next();
        
    }catch(error){
        console.log(error.message);
    }
}
const isLogout=async(req,res,next)=>{
    try{

   if(req.session.user_id){
    res.redirect('/search')
   }
   next();


    }catch(error){
        console.log(error.message);
    }
}
module.exports={
    isLogin,
    isLogout
}