var express = require('express');
var router = express.Router();
const fs = require('fs');
const data_path = 'data/user.json';
const CryptoJS = require('crypto-js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST */
router.post('/addUser', (req, res) => { // Querry parrams : email,password,access_permission,admin_email,admin_password
  var User = require('../model/user_model.js');
  // Will receive the data in the query string 
  let email = req.body.email;
  let password = req.body.password;
  let access_permission = req.body.access_permission;
  password = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password));
  // Check if admin sent the request
  let admin_email = req.body.admin_email;
  let admin_password = req.body.admin_password;
  admin_password = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(admin_password));
  // Create new client and add it to the json files
  fs.readFile(data_path, function (err, data) {
      var json = JSON.parse(data);
      let unique_email = true;
      let admin_request = false;
      json.forEach(element => {
        if(element.email == email){
          req.body.email = 'This email is already in used, please choose another one.';
          unique_email = false;
          res.send(req.body);
          return
        }
        if(element.email == admin_email && element.password == admin_password){
          admin_request = true;
        } 
      });
      if(unique_email && admin_request){
        let newUser = new User(email,password,access_permission);
        json.push(JSON.parse(JSON.stringify(newUser))); 
        fs.writeFile(data_path, JSON.stringify(json), function(err){
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
          req.session.login = email;
          req.session.access = access_permission;
          console.log(req.session.login);
          res.redirect('../client/index');
        });
      }else{
        res.redirect('../client/index');
      }
  })
  // Automaticcaly logs in the new account if created succesfully, if not redirect to login 
});

/* POST */
router.post('/login', (req, res) => { // Querry parrams : email,pswd
  let email = req.body.email;
  let pswd = req.body.password;
  pswd = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(pswd));
  // Will receive the data in the query string 
  fs.readFile(data_path, function (err, data) {
    var json = JSON.parse(data);
    var login = false;
    var access = '';
    json.forEach(element => {
      if(element.email == email){
        if(element.password == pswd){
          login = true;
          access = element.access_permission;
        }  
      }
    });
    if(login){
      console.log('The user is logged in!');
      req.session.login = email;
      req.session.access = access;
      res.redirect('../client/index');
    }else{
      res.redirect('../client/index');
    }
  });
});


module.exports = router;
