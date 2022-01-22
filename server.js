//importing express
const exp=require("express")
const app=exp()

require("dotenv").config();

//assign port no.
const port=process.env.PORT || 4300
app.listen(port,()=>{ console.log(`Server listening on port ${port}`)})

//import json middleware
app.use(exp.json())

//import express-async-handler
const asyncHandler=require("express-async-handler")

//import MongoClient object from mongodb module
const mc=require("mongodb").MongoClient

//import bycryptjs
const bcrypt = require("bcryptjs");

//import jsonwebtoken 
const jwt = require("jsonwebtoken")

//import path module
const path=require("path")

//connect dist folder with server.js
app.use(exp.static(path.join(__dirname, "dist/game-2048")))


const dburl=`mongodb+srv://${process.env.DBUsername}:${process.env.DBPassword}@2048.gprz5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

let usersObj 

//using promises
mc.connect(dburl,{useNewUrlParser:true, useUnifiedTopology:true})
.then(client=>{

    //get db
    dbObj=client.db("game2048")

    //get collection object 
    usersObj=dbObj.collection("Users")

    console.log("Connected with Database Succesfully")
})
.catch(err=>{console.error("err in db connect ",err)})

app.post('',asyncHandler(async(req,res,next)=>{
    
    let userbody = req.body
    //console.log(userbody)

    let user = {username : userbody.username, password : userbody.password, highscore : userbody.highscore}

    if(!userbody.login)
    {    //check for username existance
        let userOfDB = await usersObj.findOne({username : user.username})
    
        if(userOfDB != null)
        {
            //console.log("Username already exists");   
            res.send({message : "Username already exists"})
        }
        else
        {                
            let hashedPwd = await bcrypt.hash(user.password,6)
            user.password = hashedPwd
        
            let result = await usersObj.insertOne(user);
            //console.log("User Created Successfuly!!!")
            res.send({message : "Signed Up Successfully!!!"})
        }
    }
    else
    {
        let userOfDB = await usersObj.findOne({username : user.username})

        if(userOfDB == null)
        {
            //console.log("Invalid Username")
            res.send({message : "Invalid Username"})
        }
        else{  
            
            let result = await bcrypt.compare(user.password,userOfDB.password)

            if(!result)
            {
                //console.log("Invalid Password")
                res.send({message : "Invalid Password"})
            }
            else
            {
                let signedtoken = await jwt.sign({username : user.username},process.env.SecretKey)
                //console.log("Login Successful")
                res.send({message : "Login Successful",token : signedtoken, user : userOfDB})
            }
        }
    }
}))


app.put("",asyncHandler(async(req,res,next)=>{
    //console.log((req.body))

    let val = req.body

    if(val.changePassword)
    { 
        //check for username existance
        let userOfDB = await usersObj.findOne({username : val.username})
    
        if(userOfDB == null)
        {  
            res.send({message : "Username doesn't exist"})
        }
        else
        {            
            
            let hashedPwd = await bcrypt.hash(val.password,6)
            let result = await usersObj.updateOne({username : userOfDB.username}, {$set : {password : hashedPwd}})
        
            res.send({message : "Password updated"})
        }
    }
    else
    {    
        //get token from header of request object
        let tokenwithBearer=req.header("Authorization")
    
        //If Token doesn't exist
        if(tokenwithBearer==undefined){
            return res.send({message : "Unauthorized Access : Login to access"})
        }
    
        //if token exists
        if(tokenwithBearer.startsWith('Bearer ')){
    
            //remove first 7 chars : 'Bearer '
            let token=tokenwithBearer.slice(7,tokenwithBearer.length);
    
            //verify the token (validation of token before expire)
            jwt.verify(token,process.env.SecretKey,async(err,decoded)=>{
                if(err){
                    return res.send({message : "Session expired. Please relogin to continue"})
                }
                else{

                    let result = await usersObj.updateOne({username : req.body.username}, {$set : {highscore : req.body.highscore}})
                
                    res.send({message : "HighScore updated"})
                }
            })
        }
    }
}))
