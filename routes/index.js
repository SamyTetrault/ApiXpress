var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /* Have a look at express-session to check if the users is logged in  */
    /* If not connected redirect to login  , else shows the login pages*/
    console.log('client index session value :');
    console.log(req.session.login);
    if(req.session.login){
        res.render('index', { title: 'Express' });
    }else{
        res.render('login', { title: 'Express' });
    }
});

module.exports = router;
