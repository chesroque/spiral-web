var express = require('express');
var router = express.Router();
const auth = require("../middleware/auth");


router.get('/', auth, function(req, res, next) {
res.cookie('auth', '', {
        maxAge: 0,
        overwrite: true,
      });
  res.render('login');
  
});

module.exports = router;