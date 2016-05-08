/**
 * Created by iMac on 25/04/16.
 */
'use strict';

var date = new Date();

let mongoose = require('mongoose');
let conn = mongoose.connection;
let path = 'mongodb://localhost:27017/nodepopdb';

//Handlers de eventos de conexion
conn.on('error', console.log.bind(console, 'Connection error!'));

conn.once('open', function() {
    console.log('Connected to mongodb: ' + date);
});

// connect to database
mongoose.connect(path);
