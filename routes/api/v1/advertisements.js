/**
 * Created by iMac on 28/04/16.
 */
"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Advertisement = require('../../../models/Advertisement');

// Auth
var basicAuth = require('../../../lib/basicAuth');
var jwtAuth = require('../../../lib/jwtAuth');
var Adv = mongoose.model('Advertisement');

// aplicamos la autorizacion a todo el router

// router.use(basicAuth('admin','1234'));
//router.use(jwtAuth());

router.get('/searchAdvertisement', basicAuth('admin','1234'), function (req, res, next) {

   // Advertisement.searchAdvertisement(req, res, next);

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

    
});


router.post('/createAdvertisement', function (req, res, next) {
    var advertisement = new Advertisement(req.body);
    console.log(advertisement);


    var errors = advertisement.validateSync(); //Este metodo es sincrono
    if(errors){
        console.log(errors);
        next(new Error('Hubo errores en la validacion') + errors);
        return;
    }

    advertisement.save(function (err, saved) {
        if (err){
            next(err);    //ha habido un error y le digo a express que siga al siguiente middleware pero como es un error entonces lo que hace es ir directamete al de errr
            return;
        }
        res.json({sucess: true, saved: saved});
    });
});

router.get('/showAdevertisementFromFile', function (req, res, next) {
    console.log('Entering in showAdevertisementFromFile');
    Advertisement.showAdevertisementFromFile(req, res, next);
});



module.exports = router;