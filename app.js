const express=require('express');
const app= express();
const api=require('./api/v1/index');
const bodyParser=require('body-parser');
const auth=require('./auth/route/index');
const cors=require('cors');
const mongoose=require('mongoose');//installation de mongoose ODM de mongodb
const connection=mongoose.connection;
 const imageUrl=require('path').join(__dirname,'/upload');
 console.log('imageUrl',imageUrl);
 app.use(express.static(imageUrl))
app.set('port',(process.env.port ||3000)); //configurer le port
app.use(bodyParser.json());//Midellware body-parser
app.use(bodyParser.urlencoded({extened:true}));//Midellware body-parser
app.use(cors({
    credentials:true,
    origin:'http://localhost:4200'
}));// authorisé  les clients externs d'utliser àairees requetes pour notre server express
/// passport
const  passport=require('passport');
const cookieParser=require('cookie-parser');
const session =require('express-session');//authentification
const Strategy=require('passport-local').Strategy;
const user=require('./auth/model/user')

// configuration  pappsport
app.use(cookieParser());// middelware
app.use(session({
 secret:'my super secret',  // on sérialise un objet Javascript dans un format que l'on peut facilement transférér .
 resave:true   ,                           // on déseralise ensuite ces données reçues a fin de recnstitier l'objet  
 saveUninitialized:true
}));
//initialiser passport
app.use(passport.initialize());
app.use(passport.session());//gerer  sessions
passport.serializeUser((user,callback)=>{
    callback(null,user);
})
// recuperer  un user apartir de la session
 passport.deserializeUser((user,callback)=>{
    callback(null,user);
})
passport.use(new Strategy({
usernameField:'username',
passwordFiled:'password'
},(name,pwd,cb)=>{
   user.findOne({username:name},(err,user)=>{
       if(err){
            console.log(`this user with ${name} is`)
       }
       if(user.password !== pwd) {
        console.error(`wrong password for ${name}`);
        cb(null, false);
    } else {
        console.error(`${name} found in MongoDB and authenticated`);
        cb(null, user);
    }
   })
}));

//********************** */
app.use((req,res,next)=>{
     console.log(`req handeled on date ${new Date()}`);
    next();
})
app.use('/api/v1',api);
app.use('/auth',auth);
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
    

