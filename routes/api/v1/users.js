/**
 * Created by iMac on 28/04/16.
 */
"use strict";

var express = require('express');
var router = express.Router();
var user = require('../../../models/User');

// Authoritation JWT
var jwtAuth = require('../../../lib/jwtAuth');

// Apply de Authentication only for middleware we need

router.post('/createUser', function(req, res, next) {
    user.createUser(req, res, next);
});

router.get('/showUsers', jwtAuth(), function(req, res, next) {
    user.showUsers(req, res, next);
});

router.post('/authenticate', function(req, res, next) {
    user.authenticate(req, res, next);
});

router.delete('/removeUser', jwtAuth(), function(req, res, next) {
    user.removeUser(req, res, next);
});

router.put('/updateUser', jwtAuth(), function(req, res, next) {
    user.updateUser(req, res, next);
});

module.exports = router;
