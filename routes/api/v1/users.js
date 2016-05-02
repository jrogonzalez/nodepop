/**
 * Created by iMac on 28/04/16.
 */
"use strict";

var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var user = require('../../../models/User');
var config = require('../../../local_config');

// Auth
var basicAuth = require('../../../lib/basicAuth');
var jwtAuth = require('../../../lib/jwtAuth');

// Apply de Authentication for all middleware
//router.use(basicAuth('admin','1234'));
//router.use(jwtAuth());

router.post('/authenticate', basicAuth('admin','1234'), function(req, res, next) {
    var userame = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    console.log('user: ' + userame);
    console.log('pass: ' + password);
    console.log('mail: ' + email);
    user.authenticate(req, res, next);



});

router.post('/createUser', function(req, res, next) {
    var userame = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    console.log('user: ' + userame);
    console.log('pass: ' + password);
    console.log('mail: ' + email);
    user.createUser(req, res, next);



});

router.delete('/removeUser', basicAuth('admin','1234'), function(req, res, next) {
    var userame = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    console.log('user: ' + userame);
    console.log('pass: ' + password);
    console.log('mail: ' + email);
    user.removeUser(req, res, next);



});

router.put('/updateUser', basicAuth('admin','1234'), function(req, res, next) {
    var userame = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    console.log('user: ' + userame);
    console.log('pass: ' + password);
    console.log('mail: ' + email);
    user.updateUser(req, res, next);



});

router.get('/showUsers', basicAuth('admin','1234'), function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    console.log('username: ' + username);
    console.log('password: ' + password);
    console.log('email: ' + email);
    user.showUsers(req, res, next);
    
});

module.exports = router;