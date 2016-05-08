/**
 * Created by iMac on 23/04/16.
 */
'use strict';


var mongoose = require('mongoose');

// Define JSON File
var fs = require('fs');
var path = require('path');


var conn = mongoose.connection;
var pathDataBase = 'mongodb://localhost:27017/nodepopdb';

require('../models/Advertisement');
require('../models/User');

var Advertisement = mongoose.model('Advertisement');
var User = mongoose.model('User');

var sha256 = require('sha256');

function openDb() {

    //Handlers de eventos de conexion
    conn.on('error', console.log.bind(console, 'Connection error!'));

    conn.once('open', function() {
        console.log('Connected to mongodb');
    });

    // Conect to BBDD
    mongoose.connect(pathDataBase);

    // Drop the 'Advertisement' collection from the current database
    Advertisement.remove({}).exec(function (err) {
        if (err) {
            console.log('Advertisement BBDD removed error');
        } else {
            console.log('Advertisement database reset');
            initAdvertisements();


        }

    });

}

function initAdvertisements(){
    var file = path.join(__dirname, 'advertisements.json');

    console.log('\n *STARTING ADVERTISEMENTS* \n');

    // Check that the file exists locally
    if (!fs.existsSync(file)) {
        console.log('File not found');
    }
    // The file *does* exist
    else {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                return console.log('Advertisement can not be created');
            }

            var data2 = JSON.parse(data);

            for (var i = 0; i < data2.anuncios.length; i++) {
                var newAdvertisement = new Advertisement();
                newAdvertisement.name = data2.anuncios[i].nombre;
                newAdvertisement.sell = data2.anuncios[i].venta;
                newAdvertisement.price = data2.anuncios[i].precio;
                newAdvertisement.photo = data2.anuncios[i].foto;
                newAdvertisement.tags = data2.anuncios[i].tags;

                var errors = newAdvertisement.validateSync(); //This method is Sync
                if (errors) {
                    return console.log('Errors in Advertisement Model Validation', errors);
                }

                newAdvertisement.save(function (err) {
                    if (err) {
                        return console.log('Advertisement load error: ' + newAdvertisement.name + ' can not be created:' + err);
                    }
                });
            }
            console.log('\n *FINISHED ADVERTISEMENTS* \n');
        });
        removeUsers(initUsers);


    }
}

function removeUsers(callback){

    // Drop the 'User' collection from the current database
    User.remove({}).exec(function (err) {
        if (err) {
            console.log('User BBDD removed error');
        } else {
            console.log('User database reset');
            callback();
        }

    });

}

function initUsers(){

    var file = path.join(__dirname, 'users.json');

    console.log('\n *STARTING USERS* \n');

    // Check that the file exists locally
    if (!fs.existsSync(file)) {
        console.log('File not found');
    }
    // The file *does* exist
    else {
        fs.readFile(file, 'utf-8', function (err, dataUser) {
            if (err) {
                return console.log('Advertisement can not be created', err);
            }

            var dataU = JSON.parse(dataUser);

            for (var i = 0; i < dataU.usuarios.length; i++) {
                var user = new User();
                user.name = dataU.usuarios[i].nombre;
                user.password = sha256(dataU.usuarios[i].contrasenia);  // We do a HASH algorithm with the password
                user.email = dataU.usuarios[i].mail;
                user.pushToken = dataU.usuarios[i].pushtoken;

                var errors = user.validateSync(); //This method is Sync
                if (errors) {
                    console.log(errors);
                    return console.log('Errors in User Model Validation', err);
                }

                user.save(function (err) {
                    if (err) {
                        return console.log('User load error: ' + user.name + ' can not be created:' + err);
                    }
                });
            }
            console.log('\n *FINISHED USERS* \n');
        });
    }
}

// ******** INVOQUE INITIAL FUNCTION
openDb();


