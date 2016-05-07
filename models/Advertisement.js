/**
 * Created by iMac on 23/04/16.
 */
"use strict";

var mongoose = require('mongoose');
var assert = require('assert');
var jwt = require('jsonwebtoken');
var config = require('../local_config');
var sha256 = require('sha256');
var Regex = require("regex");

// Regex expressions
var regex_gte_lte = new RegExp('-' , "i");
var regex_gte = new RegExp('-' + '$', "i");
var regex_lte = new RegExp('^' + '-', "i");

// Define JSON File
var fs = require("fs");
var path = require('path');


var advertisementSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sell: {
        type: Boolean,
        required: true
    },
    price: Number,
    photo: String,
    tags: [{
        type: String,
        enum: ['work', 'lifestyle', 'motor', 'mobile'],
        required: true
    }]
});

// Hacer método estático
advertisementSchema.statics.list = function(filter, start, limit, sort, cb) {
    var query = Advertisement.find(filter);
    query.skip(start);
    query.limit(limit);
    query.sort(sort);
    return query.exec(cb);
};

var Advertisement = mongoose.model('Advertisement', advertisementSchema);

var advertisementOperations = function () {
    return {
        searchAdvertisement: function(req, res, next) {
            console.log('entering in searchAdvertisement');
            let name = req.query.name;
            let sell = req.query.sell;
            let tags = req.query.tag;


            console.log('traza 1');
            // NORMA: no se suele usar las variables directamente de lo que llega del metodo sino que se pasan a variables y se usan desde ahi
            var criteria = {};
            var start = parseInt(req.query.start) || 0; //esto quiere decir que si no me pasan parametro start empiezo desde la 0. Esto es pa paginacion
            var limit = parseInt(req.query.limit) || null;
            var sort = req.query.sort || null;
            var price = req.query.price || null;
            var includeTotal = req.query.includeTotal || 'true';

            if (typeof name !== 'undefined'){
                console.log('entra name');
                criteria.name = new RegExp('^' + name, "i");
            }
            if (typeof sell !== 'undefined'){
                console.log('entra sell');
                criteria.sell = sell;
            }
            if (typeof tags !== 'undefined'){
                console.log('entra tags');
                criteria.tags = tags;
            }

            console.log(price);
            if ((typeof price !== 'undefined')){

                var priceNumber = '0';

                // 10- buscará los que tengan precio mayor que 10
                if (regex_gte.test(price)){
                    priceNumber = price.substring(0,price.length-1);
                    criteria.price = { '$gte': priceNumber };
                }
                else if (regex_lte.test(price)){    // ­50 buscará los que tengan precio menor de 50
                    priceNumber = price.substr(1);
                    criteria.price = { '$lte': priceNumber };
                }else if (regex_gte_lte.test(price)){ // 10­50 buscará anuncios con precio incluido entre estos valores
                    var posicion = price.indexOf('-');
                    priceNumber = price.substr(0,posicion);
                    var priceNumber2 = price.substr(posicion+1);
                    criteria.price = { '$gte': priceNumber, '$lte': priceNumber2 };
                }else if (price !== null){ // 50 buscará los que tengan precio igual a 50
                    criteria.price = { '$lte': price};
                }else{ // buscamos por defecto los mayores que 0
                    criteria.price = { '$gte': priceNumber };
                }
            }


            Advertisement.list(criteria, start, limit, sort, function (err, rows) {
                //Adv.find(criteria).exec(function (err, rows) {
                if (err){
                    return res.json({success: false, error: err});
                }

                if (includeTotal === 'true'){
                    res.json({success: true, total: rows.length, rows: rows});
                }else{
                    res.json({success: true, rows: rows});
                }


            });

            /*
             // Creo la consulta
             var query = Agente.find(criteria);

             // ordenador por nombre descendente
             query.sort({name: -1});

             //ejecuto la consulta
             query.exec(function (err, data) {
             if (err){
             next();
             return;
             }
             res.json({sucess: true, rows: data});
             });

             */


        },
        createAdvertisement: function (req, res, next) {
            console.log('he entrado en el crea anuncio');
             let name = req.body.name;
             let sell = req.body.sell;
             let price = req.body.price;
             let photo = req.body.photo;
             let tags = req.body.tag;

            //console.log('req.query',req.body);

            let advertisement = new Advertisement({
             name: name,
             sell: sell,
             price: price,
             photo: photo,
             tags: tags
             });

             let errors = advertisement.validateSync(); //Este metodo es sincrono
             if(errors){
                console.log(errors);
                return res.json({success: false, message:'Errors in User Model Validation' + errors});

             }

             advertisement.save(function (err) {
                 if (err){
                    console.log('error en el guardado');
                    res.send({success:false, message: 'error en el guardado'});
                 }else{
                    console.log('anuncio guardado en BBDD');
                    res.send({success:true, message:'anuncio guardado en BBDD'});
                 }
             });
            

        },
        showAdevertisement: function (req, res, next) {

        },
        showAdevertisementFromFile: function (req, res, next) {
            var file = path.join(__dirname, '../data/anuncios.json');

            console.log("\n *STARTING* \n");

            // Check that the file exists locally
            if(!fs.existsSync(file)) {
                console.log("File not found");
                res.json({success: false, message: 'File not found'});
            }
            // The file *does* exist
            else {
                fs.readFile(file, 'utf-8', function (err,data) {
                    if (err){
                        console.log('Advertisement can not be created');
                        return res.json({success: false, message: 'Error in readFile bbdd'});
                    }

                    var data2 = JSON.parse(data);

                    for(var i = 0; i < data2.anuncios.length; i++) {
                        var newAdvertisement = new Advertisement();
                        newAdvertisement.name = data2.anuncios[i].nombre;
                        newAdvertisement.sell = data2.anuncios[i].venta;
                        newAdvertisement.price = data2.anuncios[i].precio;
                        newAdvertisement.photo = data2.anuncios[i].foto;
                        newAdvertisement.tags = data2.anuncios[i].tags;

                        var errors = newAdvertisement.validateSync(); //Este metodo es sincrono
                        if(errors){
                            console.log(errors);
                            return res.json({success:false, message:'Errors in Advertisement Model Validation' + errors});
                        }

                        newAdvertisement.save(function (err) {
                            if (err){
                                console.log('Advertisement can not be created');
                                return res.json({success: false, message: 'Error in create bbdd'});
                            }else{
                                console.log('Advertisement created');
                                return res.json({success: true, message: 'Advertisement created'});
                            }
                        });
                    }
                });
            }



            // Define to JSON type
            //var jsonContent = JSON.stringify(content);
            //console.log('traza2' + jsonContent);


            /*

             // Get Value from JSON
             console.log("name:", jsonContent.nombre);
             console.log("venta:", jsonContent.venta);
             console.log("precio:", jsonContent.precio);
             console.log("foto:", jsonContent.foto);
             console.log("tags:", jsonContent.tags);



             // Converting a JSON object to a String
             console.log('he entrado');
             var j =  {
             "anuncios": [ {
             "nombre": "Bicicvara",
             "venta": true,
             "precio": 230.15,
             "foto": "bici.jpg",
             "tags": [ "lifestyle", "motor"]
             }, {
             "nombre": "iPhone 3GS",
             "venta": false,
             "precio": 50.00,
             "foto": "iphone.png",
             "tags": [ "lifestyle", "mobile"]
             } ]
             };

             console.log(JSON.stringify(j));

             res.send(JSON.stringify(j));


             // Converting a String to a JSON object
             var m = "{'anuncios':[{'nombre':'Bicicvara','venta':true,'precio':230.15,'foto':'bici.jpg','tags':['lifestyle','motor']},{'nombre':'iPhone 3GS','venta':false,'precio':50,'foto':'iphone.png','tags':['lifestyle','mobile']}]}";
             var x = JSON.parse(m);
             console.log(x.key);

             res.send(x.key);

             */

        },
        tagList: function (req, res, next) {
            Advertisement.find({}, {tags:1, _id:0}).exec(function (err, rows) {

                if (err){
                    return res.json({success: false, error: err});
                }

                var salida = [];
                for(var i = 0; i < rows.length; i++) {
                    var tag = rows[i].tags;
                    for(var j = 0; j < tag.length; j++) {
                        var elem = tag[j];

                        if (salida.indexOf(elem) === -1){
                            salida.push(elem);
                        }
                    }
                }
                res.json({success: true, rows: salida});
            });
        }
    }
};



var operations = advertisementOperations();

module.exports = operations;

