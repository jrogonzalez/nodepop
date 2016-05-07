/**
 * Created by iMac on 07/05/16.
 */
"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var PushToken = require('./../../../models/PushToken');

router.post('/createPushToken', function (req, res, next) {
    console.log('entering in createPushToken');
    PushToken.createPushToken(req, res, next);
});

router.delete('/removePushToken', function (req, res, next) {
    console.log('entering in createPushToken');
    PushToken.removePushToken(req, res, next);
});

module.exports = router;
