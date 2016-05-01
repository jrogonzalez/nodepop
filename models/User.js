/**
 * Created by iMac on 24/04/16.
 */
"use strict";


var mongoose = require('mongoose');
var url = 'mongodb://localhost/nodepopdb';
var assert = require('assert');
var db = mongoose.connect(url);
var jwt = require('jsonwebtoken');
var config = require('../local_config');
var sha256 = require('sha256');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    } ,
    email: {
        type: String,
        required: true,
        unique: true
    }
});

var User = mongoose.model('User', userSchema);

var userOperations = function () {
    return {
        createUser: function(req, res, next) {
            console.log('he entrado en el createUser');
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;


            // first try to find if this user already exists en BBDD
            //var collection = db.collection("users");

            console.log('traza 3');
            User.findOne({ "name": username, "password": sha256(password), "email": email}).exec(function (err, result) {
                if (err){
                    console.log('Error al buscar el usuario: ' + username)
                }else{
                    console.log('User: ' + result);
                    if (result){
                        console.log('User: already exists in bbdd');
                        return res.json({success: false, message: 'User: already exists in bbdd'});;
                    }else{
                        //User doesnt exists and we create it

                        // We do a HASH algorithm with the password
                        var passSHA = sha256(password);
                        console.log(passSHA);

                        var user = new User({
                            name: username,
                            password: passSHA,
                            email: email
                        });

                        var errors = user.validateSync(); //Este metodo es sincrono
                        if(errors){
                            console.log(errors);
                            next(new Error('Errors in User Model Validation') + errors);
                            return;
                        }

                        console.log(user);
                        user.save(function (err)  {
                            if (err){
                                console.log('User can not be created');
                                return res.json({success: false, message: 'error in create bbdd'});
                            }else{
                                console.log('User created');
                                return res.json({success: true, message: 'User created'});
                            }
                        });

                    }

                }
            } );

            //return;
        } ,
        showUsers: function(req, res, next) {
            console.log('entering in showUsers');
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;

            User.find( {}).exec(function (err, result) {
                if (err){
                    return res.json({success: false, message: 'error in search bbdd'});
                }
                console.log(result);
                res.json({success: true,result: result});
            });

        },
        authenticate: function (req, res, next) {
            console.log('entering in loginUser');
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;

            console.log(sha256(password));
            //Usamos el findOne porque solo deberia haber uno en BBDD
            User.findOne({name: username, password: sha256(password)}).exec(function (err, user) {
                if (err){
                    return res.status(500).json({success: false, error: err});
                }
                console.log(user);
                if (!user){
                    return res.status(401).json({success: false, error: 'You are not authorized.'});
                }
                if (user.password !== password){  //We compare two HASH
                    return res.status(500).json({success: false, error: 'Incorrect Password.'});
                }

                //genero el token y esta funcion es SINCRONA
                var token = jwt.sign({id: user._id}, config.jwt.secret, {
                    expiresIn: 60 * 24 * 2       //pongo el token para que expire en 2 dias
                    //expiresInMinutes: '2 days'       //pongo el token para que expire en 2 dias
                });

                res.json({success: true, token:token});
            });
        },
        removeUser: function (req, res, next) {
            console.log('entering in removeUser');
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;


            User.findOneAndRemove( {name: username, password: sha256(password)}).exec(function (err, result) {
                if (err){
                    return res.json({success: false, message: 'error in search bbdd'});
                }else {
                    if (result){
                        console.log('entra por el result');
                        res.json({success: true,result: 'User removed from bbdd'});
                    }else {
                        res.json({success: false,result: 'User not exists in bbdd'});
                    }
                }

            });
        },
        updateUser: function (req, res, next) {
            console.log('entering in updateUser');
            var username = req.body.username;
            var password = req.body.password;
            var email = req.body.email;

            console.log(username);
            var query = {"name": username};
            var update = {$set: {password: sha256(password), email: email}};

            User.findOneAndUpdate(query, update).exec(function (err, result) {
                if (err){
                    return res.json({success: false, message: 'error in search bbdd'});
                }else {
                    if (result){
                        res.json({success: true,result: 'User updated in bbdd'});
                    }else {
                        console.log(result);
                        res.json({success: false,result: 'User not exists in bbdd'});
                    }
                }

            });
        }
    }
}

var operations = userOperations();

module.exports = operations;