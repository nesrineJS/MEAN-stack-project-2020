const express=require('express');
const router=express.Router(); // pouvoir repondre  aux requetes  coté client  généralement  le navigateur
const blogModel=require('./models/blog_post');
const multer=require('multer'); //upload images
const crypto=require('crypto'); //creation des fichiers
const path=require('path'); // path des fichiers creees
const mongoose=require('mongoose')



// file upload configuration 
const storageFile=multer.diskStorage({
    destination:'./upload/',
    filename:function(req,file,callBack){
        crypto.pseudoRandomBytes(16,function(err,raw){
            if(err) return callBack(err);
            lastUploadedImage=raw.toString('hex')+path.extname(file.originalname)
            console.log('lastUploadedImage',+lastUploadedImage)
            callBack(null,lastUploadedImage)
        });

    }
});
const Upload=multer({storage:storageFile});
 router.post('/block-posts/upload',Upload.single('image'),(req,res)=>{
     if(! req.file.originalname.match(/\.(jpg|png|gif|jpeg)$/)){
         return  res.status(400).json({
             messag:'file  error'
         })
     }
     res.status(201).send({
         file:req.file
     })
 }
 )
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
let lastUploadedImage='';
router.post('/block-posts',(req,res)=>{
     //const Bloc=new blogModel(req.body);
     const Bloc=new blogModel({...req.body,image:lastUploadedImage});
     console.log(req.body)

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
 router.delete('/block-posts',(req,res)=>{
     
     const ids=req.query.id$;
     const allIds=ids.split(',').map(element=>{
         if(element.match(/^[0-9a-fA-F]{24}$/)){// id mongoose 24 elements
             return mongoose.Types.ObjectId(element)
         }
         else{
             console.log (`le id : ${element}  n'est pas valide`)
         }

        })
   const conditions ={_id :{$in: allIds}};
   blogModel.deleteMany(conditions,(err,resultat)=>{
       if(err)
       { return res.status(500).json(err)}
      
       res.status(202).json(resultat)
       

   });
});
module.exports=router;