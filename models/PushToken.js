/**
 * Created by iMac on 24/04/16.
 */
"use strict";

var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({
    plattform: {type: String, enum: ['ios', 'android']},
    token: String,
    user: String
});

var PushToken = mongoose.model('PushToken', pushTokenSchema);
