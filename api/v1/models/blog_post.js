const mongoose=require('mongoose');
const blogSchema= new mongoose.Schema({
    title:String,
    subTitle:String,
    image:String,
    content:String,
    createdAt:{type:Date,default:new Date()}

});
module.exports=mongoose.model('BlogModel',blogSchema);