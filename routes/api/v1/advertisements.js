/**
 * Created by iMac on 28/04/16.
 */
"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Adv = require('./../../../models/Advertisement');

// Auth
var basicAuth = require('../../../lib/basicAuth');
var jwtAuth = require('../../../lib/jwtAuth');

// aplicamos la autorizacion a todo el router

//router.use(basicAuth('admin','1234'));
//router.use(jwtAuth());

router.get('/searchAdvertisement', jwtAuth(),function (req, res, next) {
   Adv.searchAdvertisement(req, res, next);
    
});


router.post('/createAdvertisement', jwtAuth(),function (req, res, next) {
    console.log('Entering in createAdvertisement');
    Adv.createAdvertisement(req, res, next);

});

router.get('/showAdevertisementFromFile', jwtAuth(),function (req, res, next) {
    console.log('Entering in showAdevertisementFromFile');
    Adv.showAdevertisementFromFile(req, res, next);
});

router.get('/tagList', function (req, res, next) {
    console.log('Entering in tagList');
    Adv.tagList(req, res, next);
});




module.exports = router;