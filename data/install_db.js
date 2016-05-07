/**
 * Created by iMac on 23/04/16.
 */
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Advertisement = mongoose.model('Advertisement');

// Define JSON File
var fs = require("fs");
var path = require('path');

var databaseOperations = function () {
    return {
        openDb: function (req, res, next) {
            // Drop the 'foo' collection from the current database
            Advertisement.remove({}).exec(function (err, result) {
                if (err) {
                    console.log('Error en el borrado de la  BBDD');
                } else {
                    console.log('Advertisement database reset');
                    initDatabase(req, res, next);

                }

            });



        }
    }
};


function initDatabase(req, res, next){
    var file = path.join(__dirname, '../data/anuncios.json');

    console.log("\n *STARTING* \n");

    // Check that the file exists locally
    if (!fs.existsSync(file)) {
        console.log("File not found");
        res.json({success: false, message: 'File not found'});
    }
    // The file *does* exist
    else {
        fs.readFile(file, 'utf-8', function (err, data) {
            if (err) {
                console.log('Advertisement can not be created');
                return res.json({success: false, message: 'Error in readFile bbdd'});
            }

            var data2 = JSON.parse(data);

            for (var i = 0; i < data2.anuncios.length; i++) {
                var newAdvertisement = new Advertisement();
                newAdvertisement.name = data2.anuncios[i].nombre;
                newAdvertisement.sell = data2.anuncios[i].venta;
                newAdvertisement.price = data2.anuncios[i].precio;
                newAdvertisement.photo = data2.anuncios[i].foto;
                newAdvertisement.tags = data2.anuncios[i].tags;

                var errors = newAdvertisement.validateSync(); //Este metodo es sincrono
                if (errors) {
                    console.log(errors);
                    return res.json({success:false, message:'Errors in Advertisement Model Validation' + errors});
                }

                newAdvertisement.save(function (err) {
                    if (err) {
                        return console.log('Advertisement load error: ' + newAdvertisement.name + ' can not be created:' + err);
                        //return res.json({success:false, message:'Advertisement can not be created' + err});
                        //return res.json({success: false, message: 'Error in create bbdd'});
                    } else {
                        //console.log('Advertisement created');
                        //return res.json({success: true, message: 'Advertisement created'});
                    }
                });
            }
        });
    }

    console.log('Advertisement database initialized');
}

var operations = databaseOperations();

module.exports = operations;

