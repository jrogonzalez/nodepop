/**
 * Created by iMac on 24/04/16.
 */
"use strict";

var mongoose = require('mongoose');

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

var operationsPushToken = function () {
    return {
        createPushToken: function (req, res, next) {
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
                console.log(errors);
                return res.json({success: false, message: 'Errors in PushToken Model Validation' + errors});

            }

            pushToken.save(function (err) {
                if (err) {
                    console.log('Error creating pushToken');
                    return res.json({success: false, message: 'Error creating pushToken'});
                }
                console.log('pushToken created');

                var query = {"name": user};
                var update = {$push: {pushToken: pt, new:true}};

                User.findOneAndUpdate(query, update).exec(function (err, result) {
                    if (err) {
                        return res.json({success: false, message: 'error in search bbdd'});
                    } else {
                        if (result) {
                            console.log('User pushToken updated in bbdd');
                            res.json({success: true, message: 'User pushToken updated in bbdd'});
                        } else {

                            console.log('User pushToken not exists in bbdd');
                            res.json({success: false, message: 'User pushToken not exists in bbdd'});
                        }
                    }

                });


            });
        },
        removePushToken: function (req, res, next) {
            let user = req.body.username;
            let pt = req.body.pushToken;
            let plattform = req.body.plattform;

            PushToken.remove({"pushToken": pt}).exec(function (err, result) {
                if (err) {
                    return res.json({success: false, message: 'error in search bbdd'});
                } else {
                    if (result) {
                        console.log('PushToken removed from bbdd');

                        var query = {"name": user};
                        var update = {$pull: {pushToken: pt}};

                        User.update(query, update).exec(function (err, result) {
                            if (err) {
                                return res.json({success: false, message: 'error in search bbdd'});
                            } else {
                                console.log('results: ' ,result);
                                if (result) {
                                    console.log('User pushToken removed in bbdd');
                                    return res.json({success: true, message: 'User pushToken removed in bbdd'});
                                } else {

                                    console.log('User pushToken not exists in bbdd');
                                    return res.json({success: false, message: 'User pushToken not exists in bbdd'});
                                }
                            }

                        });

                    } else {

                        console.log('PushToken not exists in bbdd');
                        return res.json({success: false, message: 'PushToken not exists in bbdd'});
                    }
                }
            });
        }
    }
}

var operations = operationsPushToken();

module.exports = operations;

