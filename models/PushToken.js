/**
 * Created by iMac on 24/04/16.
 */
'use strict';

var mongoose = require('mongoose');
var Error = require('./Error');

var pushTokenSchema = mongoose.Schema({
    plattform: {
        type: String,
        enum: ['ios', 'android'],
        required: true
    },
    pushToken: {
        type: String,
        required: true
    },
    user: String
});

var PushToken = mongoose.model('PushToken', pushTokenSchema);

var User = mongoose.model('User');

var operationsPushToken = function() {
    return {
        createPushToken: function(req, res) {
            let user = req.body.username;
            let pt = req.body.pushToken;
            let plattform = req.body.plattform;

            let pushToken = new PushToken({
                plattform: plattform,
                pushToken: pt,
                user: user
            });
            var errors = pushToken.validateSync(); //Este metodo es sincrono
            if (errors) {
                return Error('err006', req, res, 400);

            }

            pushToken.save(function(err) {
                if (err) {
                    return Error('err007', req, res, 400);
                }

                var query = {'name': user};
                var update = {$push: {pushToken: pt, new: true}};



                if (typeof user !== 'undefined'){

                    User.findOneAndUpdate(query, update).exec(function(err, result) {
                        if (err) {
                            return Error('err002', req, res, 400);
                        } else {
                            console.log('resul', result);
                            if (result) {
                                res.json({success: true, message: 'PushToken created and User pushToken updated in bbdd'});
                            } else {
                                res.json({success: true, message: 'PushToken created in bbdd'});
                            }
                        }
                    });
                }else{
                    res.json({success: true, message: 'PushToken created in bbdd'});
                }


            });
        },
        removePushToken: function(req, res) {
            let user = req.body.username;
            let pt = req.body.pushToken;

            if (typeof pt === 'undefined'){
                return Error('err020', req, res, 500);
            }

            PushToken.remove({'pushToken': pt}).exec(function(err, result) {
                if (err) {
                    return Error('err002', req, res, 400);
                } else {
                    if (result) {
                        var query = {'name': user};
                        var update = {$pull: {pushToken: pt}};

                        if (typeof user !== 'undefined'){

                            User.update(query, update).exec(function(err, result) {
                                if (err) {
                                    return Error('err002', req, res, 400);
                                } else {
                                    if (result) {
                                        return res.json({success: true, message: 'PushToken and User pushToken removed in bbdd'});
                                    } else {
                                        return res.json({success: true, message: 'PushToken removed in bbdd'});
                                    }
                                }

                            });
                        }else{
                            return res.json({success: true, message: 'PushToken removed in bbdd'});
                        }


                    } else {
                        return Error('err009', req, res, 400);
                    }
                }
            });
        }
    };
};

var operations = operationsPushToken();

module.exports = operations;
