var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/";


/*router.get('/', function(req, res, next) {
  var token = req.cookies.auth;
  //console.log(token)
  //res.render(' ', { title: 'Spiral' ,home: 'Home', signout: 'Sign out'});
  
});*/

/*router.get('/edit', function(req, res, next) {
    res.render('editprofile', { title: 'Spiral' ,home: 'Home', profile: 'Profile', signout: 'Sign out'});
  });*/

router.get('/:username', (req, res) => {
  console.log(req.params.username)
  MongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if (err) throw err;
    let db = client.db('spiral2');
    db.collection("users").findOne({
        username: req.params.username
    }, 
    function(err, result) {
        if (err) throw err;
        //res.json(result);
        //console.log(result)
        let navBar = {
          title: 'Spiral' ,
          home: 'Home', 
          profile: 'Profile', 
          signout: 'Sign out'
          //category: 'Category'
        }
        let params = {
          ...result,
          ...navBar
        }

        res.render('profile', params);
    });
});
});

router.post('/', function(req, res, next) {
  console.log('Hellooooooooooooooooo!') 
 MongoClient.connect('mongodb://localhost:27017', function(err, client){
   if(err) throw err;
   let db = client.db('spiral2');
   var post = req.body;
   console.log(req.body) 
   db.collection('items').insert(post, {
    safe: true
  }, function(error, result) {
    if (error) {
      res.render('error', {
        message: 'Item Save Failed!'
      });
    }
    else {
      //res.redirect("/profile");
    }
  });
  });  
});  


    
module.exports = router;
