const express = require('express');
const bodyparser=require("body-parser")
const bcrypt=require("bcrypt");
const user=require('./models/user');
const mongoose = require('mongoose');
const expressValidator = require("express-validator");
const {check, validationResult} = require('express-validator/check')

const app = express();
const port = process.env.PORT || 80
mongoose.connect("mongodb://localhost:27017/user",{userNewUrlParser : true});
app.set('view engine', 'pug');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));




//handling get request

app.get('/',function(req,res){

res.render('index')
})

app.get('/Login',function(req,res){

    res.render('Login')
    })

app.get('/Register',
    function(req,res){
      
    res.render('Register')
    })

//handling post request

app.post('/Register',
[
    check('username').not().isEmpty().isLength({min:5}).withMessage('User name must be 5 characters'),
    check('password').not().isEmpty().isLength({min:6}).withMessage('Password name must be 6 characters'),
    check('age').not().isEmpty().isInt().withMessage('age  must be integer'),
    check('mobile').not().isEmpty().isInt().isLength({min:10}).withMessage('mobile number must be number and 10 characters'),
    check('cpassword').custom((value,{req}) => (value === req.body.password)).withMessage("Confirm password not match with your password"),
    check('email').not().isEmpty().isEmail().normalizeEmail().withMessage("Enetr proper email"),
],

    function(req,res){
        
        const errors= validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(422).jsonp(errors.array());
        }
        else{

        //console.log(req.body.username)
        const newUser=new user();
        newUser.username=req.body.username;

        
        var salt=bcrypt.genSaltSync(10);
        var hash=bcrypt.hashSync(req.body.password,salt);

        newUser.password=hash;

        newUser.age=req.body.age;
        newUser.mobile=req.body.mobile;

        newUser.save(function(err,result){

            if(err){

                console.log(err);
            }
            else{
                console.log(result);
                res.redirect("Login");
            }
            
        })
    
    }

    })

    app.post('/Login',function(req,res){
        
        user.findOne({username:req.body.username},function(err,docs){
            if(err)
            {
                console.log(err)
            
            }
            else
            {
                if(docs.username==req.body.username)
                {
                    bcrypt.compare(req.body.password,docs.password,function(err,data)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        if(data)
                        {
                            console.log(data);
                            res.send("Welcome");
                        }
                        else
                        {
                            res.send("invalid password");
                        }

                    });
                    

                   
                    
                }
                else
                {
                    //res.send("invalid username or password")
                    res.redirect("Register");
                }

            }

        })
        

        })
    

        app.get('/ajax', function(req, res){
            res.render('ajax', {title: 'An Ajax Search', name: "Search user!"});
        });
        app.post('/ajax', function(req, res){

            user.findOne({username:req.body.name},function(err,docs){
                if(err)
                {
                    console.log(err)
                
                }
                else
                {
                    
                        res.render('ajax', {title: 'An Ajax search', name: "Name "+docs.username+", Age "+docs.age+", Mobile "+docs.mobile });
                   
                }
            });
              
        

           
        });


app.listen(port,() => {console.log(`app is listening on http://localhost:${port}`)})