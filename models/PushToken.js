/**
 * Created by iMac on 24/04/16.
 */
"use strict";

var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({
    plataforma: {type: String, enum: ['ios', 'android']},
    token: String,
    usuario: String
});

var PushToken = mongoose.model('pushTokens', pushTokenSchema);
