const mongoose=require('mongoose');
const blogSchema= new mongoose.Schema({
    title:String,
    subtitle:String,
    image:String,
    smallImage:String,
    content:String,
    createdAt:{type:Date,default:new Date()}

});
module.exports=mongoose.model('BlogModel',blogSchema);