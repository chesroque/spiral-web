/*var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
let MongoClient = require('mongodb').MongoClient;



var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');


// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}*/

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('home', { title: 'Spiral' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Spiral' });
});

router.post('/register', function(req, res, next) {
    console.log('Hellooooooooooooooooo!') 
   MongoClient.connect('mongodb://localhost:27017', function(err, client){
     if(err) throw err;
     let db = client.db('spiral2');
     var post = req.body;
     var busboy = new Busboy({ headers: req.headers });
     console.log(busboy);
     busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join('.', filename);
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      console.log('Upload complete');
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });
     db.collection('users').insert(post, {
      safe: true
    }, function(error, result) {
      if (error) {
        res.render('error', {
          message: 'User Save Failed!'
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
const auth = require("../middleware/auth");
const User = require("../model/User");
var sess;

router.get('/', function(req, res, next) {
  res.render('home', { title: 'Spiral' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Spiral' });
});
/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

 

router.post(
    "/register",
    [
        check("username", "Please Enter a Valid Username")
        .not()
        .isEmpty(),
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

        const {
            username,
            fname,
            lname,
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (user) {
              res.status(400);
              res.render("signup", {message :'User Already Exists'})               
               /*return res.status(400).json({
                    msg: "User Already Exists"
                });*/
            }

            user = new User({
                username,
                fname,
                lname,
                email,
                password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                "randomString", {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err;
                    /*res.status(200).json({
                        token
                    });*/

                    res.redirect("/login")
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);

router.get("/profile", auth, async (req, res) => {
  //sess = req.session;
  
  //console.log(token)
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    //res.json(user);
    let profile = {
      title: 'Spiral' ,
      home: 'Home', 
      profile: 'Profile', 
      signout: 'Sign out',
      username: user.username,
      fname: user.fname,
      lname: user.lname, 
      email: user.email
      //category: 'Category'
    }

    console.log(profile)
    res.render('profile', profile);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
