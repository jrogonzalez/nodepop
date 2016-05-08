/**
 * Created by iMac on 01/05/16.
 */
/**
 * Created by iMac on 26/04/16.
 */
'use strict';

var basicAuth = require('basic-auth');

module.exports = function(username, password) {
    return function(req, res, next) {
        var user = basicAuth(req);
        if (!user || user.name !== username || user.pass !== password) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.sendStatus(401);
            return;
        }
        next();
    };
};
