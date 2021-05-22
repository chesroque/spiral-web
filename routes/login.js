/*var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
let MongoClient = require('mongodb').MongoClient;


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Spiral' });

});

router.post('/', function(req, res, next) {
    console.log("testttttttttt")
    MongoClient.connect('mongodb://localhost:27017', function(err, client){
        if(err) throw err;
        let db = client.db('spiral2');
        var post = req.body;
        console.log("test")
        db.collection('login').insert(post, {
         safe: true
       }, function(error, result) {
         if (error) {
           res.render('error', {
             message: 'Login Failed!'
           });
         }
         else {
           res.redirect("/");
         }
             });

          });

  });

module.exports = router;*/

const express = require("express");
const { check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
var sess;

const User = require("../model/User");


router.get('/', function(req, res, next) {
  res.render('login', { title: 'Spiral' });
});

router.post(
  "/",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 3
    })
  ],
  async (req, res) => {
   const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    console.log(req.body)
    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
              //res.status(400);
              //res.render("login", {message :'Incorrect Password'})   
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          
            /*sess=req.session;
            sess.email = email;
            sess.token = token;*/
            res.cookie('auth',token);
            res.redirect('/profile');
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);



module.exports = router;