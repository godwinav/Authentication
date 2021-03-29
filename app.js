require('dotenv').config()
const express = require("express")
const ejs = require("ejs")
const mongoose=require("mongoose")
// const bodyParser=require("body-parser")
const encrypt = require("mongoose-encryption")
const app = express()
const port = 3000


mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true})
const userSchema = new mongoose.Schema({
    email:String,
    password:String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:  ["password"] })



const User = new mongoose.model("User", userSchema)

app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))




app.get("/", (req, res) => {
  res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",(req,res)=>{
    const userName=req.body.email
    const password= req.body.password

    User.findOne({email:userName}, (err,data)=>{
        if(err){console.log(err);}
        else{
            if(data){
                if(data.password=== password){
                    res.render("secrets")
                }
            }
        }
    })
})


app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const newUser = new User({
        email:req.body.email,
        password:req.body.password
    })
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})
app.get("/secrets",(req,res)=>{
    res.render("secrets")
})
app.get("/submit",(req,res)=>{
    res.render("submit")
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})