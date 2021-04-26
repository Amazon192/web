require('dotenv').config();
const express=require('express');
const bodyparser=require('body-parser');
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');

const app=express();

mongoose.connect("mongodb://localhost:27017/useDB",{useNewUrlParser:true, useUnifiedTopology: true});

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
    extended:true
}));

const k= new mongoose.Schema({
       email:String,
       password:String
});


 
k.plugin(encrypt,{ secret: process.env.SECRET,encryptedFields:["password"]});

const sec=mongoose.model('sec',k);


app.route("")
    .get(function(req,res){
    res.render("home");
    });

app.route("/login")
    .get(function(req,res){
    res.render("login");
    })
    
    .post(function(req,res){
    const user=req.body.username;
    const pass=req.body.password;
    sec.findOne({email:user},function(err,result){
        if(err){
            console.log("error");
        }
        else
            if(result){
            if(result.password===pass){
                res.render("secrets");
            }
        }
    });
    });

app.route("/register")
    .get(function(req,res){
    res.render("register");
    })

    .post(function(req,res){
       const  x=new sec({
           email:req.body.username,
           password:req.body.password
       })
      x.save(function(err){
          if(!err) res.render("login")
          else console.log("nee")
      })
    })







app.listen(3000,function(){
    console.log("runnin");  
})