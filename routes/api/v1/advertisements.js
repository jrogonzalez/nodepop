/**
 * Created by iMac on 28/04/16.
 */
"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Adv = require('./../../../models/Advertisement');

// Auth
var basicAuth = require('../../../lib/basicAuth');
var jwtAuth = require('../../../lib/jwtAuth');

// aplicamos la autorizacion a todo el router

router.use(basicAuth('admin','1234'));
router.use(jwtAuth());

router.get('/searchAdvertisement', function (req, res, next) {
   Adv.searchAdvertisement(req, res, next);
    
});


router.post('/createAdvertisement', function (req, res, next) {
    var advertisement = new AAA(req.body);
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
    Adv.showAdevertisementFromFile(req, res, next);
});

router.get('/tagList', function (req, res, next) {
    console.log('Entering in tagList');
    Adv.tagList(req, res, next);
});




module.exports = router;