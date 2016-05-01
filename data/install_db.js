/**
 * Created by iMac on 23/04/16.
 */
let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();
let advertisement = mongoose.model('Advertisement');

let openDb = function() {

    // Drop the 'foo' collection from the current database
    mongoose.connection.db.dropCollection('Advertisement', function(err, result) {
        if (err){
            console.log('Error en el borrado de la  BBDD');
        }else {
            console.log('La BBDD se ha reseteado');
        }

    });

    let file = path.join(__dirname, './anuncios.json');

    console.log("\n *STARTING* \n");

    // Check that the file exists locally
    if(!fs.existsSync(file)) {
        console.log("File not found");
    }

    // The file *does* exist
    else {
        // Read the file and do anything you want
        content = fs.readFileSync(file, 'utf-8');
    }


    console.log('traza 1' + content);

};


router.get('/', function (req, res, next) {
    openDb();

});
/*
let resetDB = function(db) {
    db.collection('coches').remove({});
    console.log('La BBDD se ha reseteado');
    return;
};

let resetDB = function(db) {
    db.collection('coches').drop( function(err, response) {
        console.log(response)
        callback();
    });
};


// INSERT
let insertDocument = function(db, callback) {
    db.collection('restaurants').insertOne( {
        "address" : {
            "street" : "2 Avenue",
            "zipcode" : "10075",
            "building" : "1480",
            "coord" : [ -73.9557413, 40.7720266 ]
        },
        "borough" : "Manhattan",
        "cuisine" : "Italian",
        "grades" : [
            {
                "date" : new Date("2014-10-01T00:00:00Z"),
                "grade" : "A",
                "score" : 11
            },
            {
                "date" : new Date("2014-01-16T00:00:00Z"),
                "grade" : "B",
                "score" : 17
            }
        ],
        "name" : "Vella",
        "restaurant_id" : "41704620"
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback();
    });
};


MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        db.close();
    });
});

// FIND ALL
let findRestaurants = function(db, callback) {
    let cursor =db.collection('restaurants').find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findRestaurants(db, function() {
        db.close();
    });
});

// FIND WITH FILTERS
let findRestaurants = function(db, callback) {
    let cursor =db.collection('restaurants').find( { "borough": "Manhattan" } );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findRestaurants(db, function() {
        db.close();
    });
});

// UPDATE DATA
let updateRestaurants = function(db, callback) {
    db.collection('restaurants').updateOne(
        { "name" : "Juni" },
        {
            $set: { "cuisine": "American (New)" },
            $currentDate: { "lastModified": true }
        }, function(err, results) {
            console.log(results);
            callback();
        });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    updateRestaurants(db, function() {
        db.close();
    });
});

//DELETE ALL BBDD
let dropRestaurants = function(db, callback) {
    db.collection('restaurants').drop( function(err, response) {
        console.log(response)
        callback();
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    dropRestaurants(db, function() {
        db.close();
    });
});*/



module.exports = router;

