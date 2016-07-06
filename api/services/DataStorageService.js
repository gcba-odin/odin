var MongoClient = require('mongodb').MongoClient;

module.exports = {

    mongoConnect: function(dataset, filename, res, cb) {
        // Connect to the db
        MongoClient.connect("mongodb://" + sails.config.odin.dataStorage.host + ":" +
            sails.config.odin.dataStorage.port + "/" + dataset,
            function(err, db) {
                if (err && !res.headersSent) return res.negotiate(err);
                cb(db);
            });
    },
    mongoSave: function(dataset, filename, json, res) {

        DataStorageService.mongoConnect(dataset, filename, res, function(db) {
            var collection = db.collection(filename);
            collection.insert(json, {
                w: 1
            }, function(err) {
                if (err && !res.headersSent) return res.negotiate(err);
            });
        });
    },
    mongoCount: function(dataset, filename, res, cb) {
        DataStorageService.mongoConnect(dataset, filename, res, function(db) {
            var collection = db.collection(filename);
            collection.count({}, function(err, count) {
                if (err) console.error(err);
                cb(count);
            });
        });
    },
    deleteCollection: function(dataset, filename, res) {
            DataStorageService.mongoConnect(dataset, filename, res, function(db) {
                db.collection(filename).drop();
            });
        }
        // getData: function(dataset, filename, res, cb) {
        //     DataStorageService.mongoConnect(dataset, filename, res, function(db) {
        //         var collection = db.collection(filename);
        //         // TODO: find gets only first 20?
        //         var cursor = collection.find()

    //         cursor.forEach(function(tmp) {
    //             console.dir(tmp)
    //         });

    //         cb(collection.find());
    //     })
    // }
};