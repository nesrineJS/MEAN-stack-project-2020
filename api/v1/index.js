const express=require('express');
const router=express.Router(); // pouvoir repondre  aux requetes  coté client  généralement  le navigateur
const blogModel=require('./models/blog_post');
router.get('/ping', (req,res)=>{
     res.status(200).json({
         msg:"pong !",
         date: new Date()
     })
});
router.get('/block-posts', (req,res)=>{
    blogModel.find()
    .sort({'createdAt':-1})
    .exec()// promise donc il faut  then
    .then((blogs)=>res.status(200).json(blogs))
    .catch(err=>res.status(500).json({
        message:"blog not found",
        error:err
    }))
    
    
});
router.post('/block-posts',(req,res)=>{
     console.log(req.body)
     const Bloc=new blogModel(req.body);
     Bloc.save((err,Bloc)=>{
if(err){
    res.status(500).json(err)
} 
res.status(201).json(Bloc)

     });
 })
 router.get('/block-posts/:id',(req,res)=>{
   
    const id=req.params.id;
    blogModel.findById(id).then(
        blog=>{
            res.status(200).json(blog)
        }
    ).catch(err=>{
        res.status(500).json({
            message:"blog not find by this id",
            error:err
        })
    })
})
router.delete('/block-posts/:id',(req,res)=>{
   
    const id=req.params.id;
    blogModel.findByIdAndDelete(id,(err,blog)=>{
  if(err){
      res.status(500).json({
          error:err
      })
  }
  res.status(202).json({
      message:`this object with this id:${id}is deleted`,
     // blogs:[blogModel.find()]
  })
    })
       /* blogModel.deleteOne(blogModel.findById(id)).then(
        blog=>{
            res.status(200).json(blog)
        }
    ).catch(err=>{
        res.status(500).json({
            message:"blog not find by this id",
            error:err
        })
    })*/
})
module.exports=router;