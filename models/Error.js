/**
 * Created by iMac on 02/05/16.
 */
'use strict';

// Load Module and Instantiate
var i18n = new (require('i18n-2'))({
    locales: ['es', 'en'],
    defaultLocale: 'es',
    queryParameter: 'lang'
});

function returnError(err, req, res) {
    i18n.setLocale(req.lang);
    var sal = i18n.__(err);
    res.json({sucess: false, message: sal});
}

module.exports = returnError;
