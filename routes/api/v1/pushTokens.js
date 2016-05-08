/**
 * Created by iMac on 07/05/16.
 */
'use strict';

var express = require('express');
var router = express.Router();
var PushToken = require('./../../../models/PushToken');

// Auth
var jwtAuth = require('../../../lib/jwtAuth');

router.post('/createPushToken', function(req, res, next) {
    PushToken.createPushToken(req, res, next);
});

router.delete('/removePushToken', jwtAuth(),function(req, res, next) {
    PushToken.removePushToken(req, res, next);
});

module.exports = router;
