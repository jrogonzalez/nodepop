/**
 * Created by iMac on 28/04/16.
 */
'use strict';

var express = require('express');
var router = express.Router();
var Adv = require('./../../../models/Advertisement');

// Auth
var jwtAuth = require('../../../lib/jwtAuth');

// Apply de Authentication only for middleware we need

router.get('/searchAdvertisement', jwtAuth(), function(req, res, next) {
    Adv.searchAdvertisement(req, res, next);
});

router.post('/createAdvertisement', jwtAuth(), function(req, res, next) {
    Adv.createAdvertisement(req, res, next);
});

router.get('/showAdevertisement', jwtAuth(), function(req, res, next) {
    Adv.showAdevertisement(req, res, next);
});

router.get('/tagList', function(req, res, next) {
    Adv.tagList(req, res, next);
});

module.exports = router;
