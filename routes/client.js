var express = require('express');
var router = express.Router();
const fs = require('fs');
const { query } = require('express');
const data_path = 'data/client_info.json';
var ensureAuthenticated = function(req, res, next) {
    console.log(req);
    if (req.session.login) {
        return next();
    }
    res.render('login', { title: 'Express' });
};

/* GET */
router.get('/index',ensureAuthenticated,function(req, res, next) {
    fs.readFile(data_path, function (err, data) {
        if (err) {
            console.error(err);
            return res.send('An error occurred while reading the file');
        }
        var client_info = [];
        var json = JSON.parse(data);
        // Return the data of the website the user has access, MASTER returns all data fro admins
        if(req.session.access == 'MASTER'){
            client_info = json;
        }else{
            json.forEach(element =>{
                if(element.website == req.session.access){
                    client_info.push(element);
                }
            });
        } 
        if(req.query.filter){
            var filter = req.query.filter;
            var order = req.query.order;
            client_info = sortData(client_info,filter,order);
        }
        res.render('index2', { title: 'Express',data: client_info });
    })
});

/* POST */
router.post('/addClientInfo', (req, res) => { // Querry parrams : name,phone,email,website
    var Client = require('../model/client_model.js');
    // Will receive the data in the query string 
    let name = req.query.name;
    let phone = req.query.phone;
    let email = req.query.email;
    let website = req.query.website;
    // Make verification to data
    if(name.length > 60 || name.length <= 0){
        req.query.name = 'The amount of characters is not respected (min:1,max:60)';
        res.send(req.query);
        return
    }
    if(phone.length > 16 || phone.length < 10){ // 14 : (1)-515-555-5555 & 10 : 1234567890
        req.query.phone = 'Invalid Format';
        res.send(req.query);
        return
    }
    // Create new client and add it to the json files
    let newClient = new Client(name,phone,email,website);
    fs.readFile(data_path, function (err, data) {
        var json = JSON.parse(data);
        json.push(JSON.parse(JSON.stringify(newClient))); 
        fs.writeFile(data_path, JSON.stringify(json), function(err){
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
    })
    console.log(newClient);
    res.send(newClient);
});

/* PUT */ 

router.delete('/deleteClientInfo/:id', function(res,req) {
    // Read the json files to find it and deletes it;
    var idToRemove = req.req.params.id;
    console.log(idToRemove);
    fs.readFile(data_path, function (err, data) {
        var json = JSON.parse(data);
        json.forEach(element => {
            if(element.id == idToRemove){
                json.splice(json.indexOf(element),1);
                fs.writeFile(data_path, JSON.stringify(json), function(err){
                if (err) throw err;
                    console.log('The "data to append" was appended to file!');
                });
                return;
            }
        });
    })
    req.end('The data was deleted succesfully');
});

function sortData(data, filter, order) {
    var sortByField = require('../public/javascripts/filter.js');
    switch (filter) {
        case 'name':
            return sortByField(data, 'name', order);
        case 'phone':
            return sortByField(data, 'phone', order);
        case 'email':
            return sortByField(data, 'email', order);
        case 'website':
            return sortByField(data, 'website', order);
        case 'datetime':
            return sortByField(data, 'datetime', order);
        default:
            return data;
    }
}

module.exports = router;
