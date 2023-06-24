//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


//connecting to DB
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

/****** Schema for mongoose-encrytion ******/
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

// /****** encrypting ******/
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

//Collection
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        
        const newUser = new User({
            email: req.body.username,
            password: hash              //md5(req.body.password)
        });

        newUser.save();
        res.render("secrets");
    });    
});

app.post("/login", async function(req, res) {

    const username = req.body.username;
    const password = req.body.password;                      //md5(req.body.password);
    
    const foundUser= await User.findOne({ email: username });

    if(foundUser){
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if(result){
                res.render("secrets");
            }    
        });
    }
});


app.listen(3000, function(){
    console.log("Server started");
})