module.exports = {

    mongoConnect: function(dataset, filename, res, cb) {

        var MongoClient = require('mongodb').MongoClient;

        // Connect to the db
        MongoClient.connect("mongodb://" + sails.config.odin.filesDb.host + ":" +
            sails.config.odin.filesDb.port + "/" + dataset,
            function(err, db) {
                if (err && !res.headersSent) return res.negotiate(err);
                cb(db)
            });
    },
    mongoSave: function(dataset, filename, json, res) {

        // var MongoClient = require('mongodb').MongoClient;

        // Connect to the db
        // MongoClient.connect("mongodb://" + sails.config.odin.filesDb.host + ":" +
        // sails.config.odin.filesDb.port + "/" + dataset,
        // function(err, db) {
        // if (err && !res.headersSent) return res.negotiate(err);
        DataStorageService.mongoConnect(dataset, filename, res, function(db) {
            var collection = db.collection(filename);
            collection.insert(json, {
                w: 1
            }, function(err) {
                if (err && !res.headersSent) return res.negotiate(err)
            });
        });
    },
    mongoCount: function(dataset, filename, res, cb) {
        // var MongoClient = require('mongodb').MongoClient;
        // Connect to the db
        // MongoClient.connect("mongodb://" + sails.config.odin.filesDb.host + ":" +
        // sails.config.odin.filesDb.port + "/" + dataset,
        // function(err, db) {
        // if (err && !res.headersSent) return res.negotiate(err);
        DataStorageService.mongoConnect(dataset, filename, res, function(db) {
            var collection = db.collection(filename);
            collection.count({}, function(err, count) {
                cb(count);
            });
        });
    },
    deleteCollection: function(dataset, filename, res) {
        DataStorageService.mongoConnect(dataset, filename, res, function(db) {
            db.collection(filename).drop();
        });
    }
}