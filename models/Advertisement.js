/**
 * Created by iMac on 23/04/16.
 */
"use strict";


var mongoose = require('mongoose');
// Define JSON File
var fs = require("fs");
var content = '';
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
    tags: [String]
});


var advertisement = mongoose.model('Advertisement', advertisementSchema);

var Adv = mongoose.model('Advertisement');

//var crearAnuncio = function (nombre, venta, precio, foto, tags) {
//    return function (err, nombre, venta, precio, foto, tags) {

var advertisementOperations = function () {

    return {

            searchAdvertisement: function (req, res, next) {
                console.log('entering in searchAdvertisement');
                var name = req.query.name;


                console.log('traza 1');
                // NORMA: no se suele usar las variables directamente de lo que llega del metodo sino que se pasan a variables y se usan desde ahi
                var criteria = {};
                var start = parseInt(req.query.start) || 0; //esto quiere decir que si no me pasan parametro start empiezo desde la 0. Esto es pa paginacion
                var limit = parseInt(req.query.limit) || null;
                var sort = req.query.sort || null;
                var price = req.query.price || 0;
                let includeTotal = req.query.includeTotal || true;


                if (typeof name !== 'undefined'){
                    criteria.name = newRegExp('^' + name, "i");
                }


                Adv.list(criteria, start, limit, sort, function (err, rows) {
                    if (err){
                        return res.json({succes: false, error: err});
                    }
                    console.log('salida de consulta: ', rows);

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

                res.json({succes: true, rows: rows});
            },
         createAdvertisement: function (req, res, next) {
            //return console.log('he entrado en el crea anuncio');
             res.send('he entrado en el crea anunciooooooo');

            //console.log('req.query',req.body);

            /*var anuncio = new anuncioModel({
             nombre: nombre,
             venta: venta,
             precio: precio,
             foto: foto,
             tags: tags
             })

             db.openDb();

             anuncio.save(function (err) {
             if (err){
             console.log('error en el guardado');
             res.send('error en el guardado');
             }else{
             console.log('anuncio guardado en BBDD');
             res.send('anuncio guardado en BBDD');
             }
             });*/
            //next();

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
                        var newAdvertisement = new advertisement();
                        newAdvertisement.name = data2.anuncios[i].nombre;
                        newAdvertisement.sell = data2.anuncios[i].venta;
                        newAdvertisement.price = data2.anuncios[i].precio;
                        newAdvertisement.photo = data2.anuncios[i].foto;
                        newAdvertisement.tags = data2.anuncios[i].tags;
                        newAdvertisement.save(function (err) {
                            if (err){
                                console.log('Advertisement can not be created');
                                //return res.json({success: false, message: 'Error in create bbdd'});
                            }else{
                                console.log('Advertisement created');
                                //return res.json({success: true, message: 'Advertisement created'});
                            }
                        });
                    }
                });
            }

            res.json({success: true, message: 'Advertisement created'});

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
        listTags: function (req, res, next) {

        }


    }

};

var operations = advertisementOperations();

module.exports = operations;
