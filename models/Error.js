/**
 * Created by iMac on 02/05/16.
 */
"use strict";
var langProperties = require('../lang_properties');

function returnError(err, req, res){
    var lang = req.query.language;
    var message = '';
    message = langProperties.en.error1;
    //res.status(sta).json(mensaje traducido con req.lang)
    res.json({success: false, message: message});

}

module.exports = returnError;