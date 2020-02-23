const express=require('express');
const app= express();
const api=require('./api/v1/index');
const bodyParser=require('body-parser');
const cors=require('cors');
const mongoose=require('mongoose');//installation de mongoose ODM de mongodb
const connection=mongoose.connection;

app.set('port',(process.env.port ||3000)); //configurer le port
app.use(bodyParser.json());//Midellware body-parser
app.use(bodyParser.urlencoded({extened:true}));//Midellware body-parser
app.use(cors());// authorisé  les clients externs d'utliser àairees requetes pour notre server express


app.use((req,res,next)=>{
     console.log(`req handeled on date ${new Date()}`);
    next();
})
app.use('/api/v1',api);
app.use((req,res)=>{ //  CREATION DE MIDELLWARE SANS NEXT() pas besoin  ICI
    const err=new Error('404 not found');
    err.status=404;
    res.json({msg:'404 not found',
     status:err.status});}
     );
mongoose.connect('mongodb://localhost:27017/nesrinedatabase',{useNewUrlParser:true});
connection.on('error',(err)=>{
    console.log(`connection to mongodb is not established error :{$err.msg}`);
});
connection.once('open',()=>{
    console.log(`connection to mongodb is established successfuly `);
    app.listen(app.get('port'),()=>{  //recuperer le port configurer 
        console.log(`server is listening on port ${app.get('port')}`); //eslint-disable-line no-console
    })
})
    

