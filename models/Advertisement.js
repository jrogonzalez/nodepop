/**
 * Created by iMac on 23/04/16.
 */
'use strict';

var mongoose = require('mongoose');
var Error = require('./Error');

// Regex expressions
var regex_gte_lte = new RegExp('-' , 'i');
var regex_gte = new RegExp('-' + '$', 'i');
var regex_lte = new RegExp('^' + '-', 'i');

// Define JSON File
var fs = require('fs');
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
    tags: [ {
        type: String,
        enum: ['work', 'lifestyle', 'motor', 'mobile'],
        required: true
    } ]
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

var advertisementOperations = function() {
    return {
        searchAdvertisement: function(req, res) {
            let name = req.query.name;
            let sell = req.query.sell;
            let tags = req.query.tag;

            // NORMA: no se suele usar las variables directamente de lo que llega del metodo sino que se pasan a variables y se usan desde ahi
            var criteria = {};
            var start = parseInt(req.query.start) || 0; //esto quiere decir que si no me pasan parametro start empiezo desde la 0. Esto es pa paginacion
            var limit = parseInt(req.query.limit) || null;
            var sort = req.query.sort || null;
            var price = req.query.price || null;
            var includeTotal = req.query.includeTotal || 'true';

            if (typeof name !== 'undefined'){
                console.log('entra name');
                criteria.name = new RegExp('^' + name, 'i');
            }
            if (typeof sell !== 'undefined'){
                console.log('entra sell');
                criteria.sell = sell;
            }
            if (typeof tags !== 'undefined'){
                console.log('entra tags');
                criteria.tags = tags;
            }

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

            Advertisement.list(criteria, start, limit, sort, function(err, rows) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                if (includeTotal === 'true'){
                    res.json({success: true, total: rows.length, advertisements: rows});
                }else{
                    res.json({success: true, advertisements: rows});
                }
            });
        },
        createAdvertisement: function(req, res) {
             let name = req.body.name;
             let sell = req.body.sell;
             let price = req.body.price;
             let photo = req.body.photo;
             let tags = req.body.tag;

            let advertisement = new Advertisement({
             name: name,
             sell: sell,
             price: price,
             photo: photo,
             tags: tags
             });

             let errors = advertisement.validateSync(); //This method is Sync
             if(errors){
                 return Error('err001', req, res, 400);
             }

             advertisement.save(function(err) {
                 if (err){
                    res.send({success:false, message: 'error en el guardado'});
                 }else{
                    res.send({success:true, message:'anuncio guardado en BBDD'});
                 }
             });
        },
        showAdevertisement: function(req, res) {
            Advertisement.find({}).exec(function (err, results) {
                if (err){
                    return Error('err002', req, res, 400);
                }
                res.json({success: true, results: results});
            });
        },
        tagList: function(req, res) {
            Advertisement.find({}, {tags:1, _id:0}).exec(function(err, rows) {

                if (err){
                    return Error('err002', req, res, 400);
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
                res.json({success: true, taglist: salida});
            });
        }
    };
};

var operations = advertisementOperations();

module.exports = operations;
