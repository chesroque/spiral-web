var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
let MongoClient = require('mongodb').MongoClient;

router.get('/', function(req, res, next) {
  res.render('checkout', { title: 'Spiral' });
    
});

router.post('/', function(req, res, next) {
  console.log("testttttttttt")
  MongoClient.connect('mongodb://localhost:27017', function(err, client){
      if(err) throw err;
      let db = client.db('spiral2');
      var post = req.body;
      console.log("test")
      db.collection('checkout').insert(post, {
       safe: true
     }, function(error, result) {
       if (error) {
         res.render('error', {
           message: 'Checkout Save Failed!'
         });
       }
       else {
         res.redirect("/");
       }
           });
 
        });
      });

module.exports = router;