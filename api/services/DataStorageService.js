const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
var bulkConnectionDb;

module.exports = {

    mongoConnect: function (dataset, filename, res, cb) {
        // Connect to the db
        MongoClient.connect("mongodb://" + sails.config.odin.dataStorage.host + ":" +
            sails.config.odin.dataStorage.port + "/" + dataset,
            function (err, db) {
                if (err && !res.headersSent) return res.negotiate(err);
                cb(db);
            });
    },
    mongoSave: function (dataset, filename, json, res) {
        json = _.transform(json, function (result, each) {
            result.push(_.mapKeys(each, function (value, key) {
                return _.replace(key, ".", " ");
            }));
        }, [])
        DataStorageService.mongoConnect(dataset, filename, res, function (db) {
            var collection = db.collection(filename);
            collection.insert(json, {
                w: 1
            }, function (err) {
                if (err && !res.headersSent) return res.negotiate(err);
                db.close();
            });
        });
    },
    mongoBulkInit: function (dataset, filename, res, cb) {
        if (bulkConnectionDb) {
            cb();
        } else {
            DataStorageService.mongoConnect(dataset, filename, res, function (db) {
                bulkConnectionDb = db;
                cb();
            });
        }
    },
    mongoBulkSave: function (dataset, filename, json, res, close) {
        json = _.transform(json, function (result, each) {
            result.push(_.mapKeys(each, function (value, key) {
                return _.replace(key, ".", " ");
            }));
        }, []);
        if (bulkConnectionDb) {
            DataStorageService.bulkInsert(filename, json, res, close);
        } else {
            DataStorageService.mongoConnect(dataset, filename, res, function (db) {
                bulkConnectionDb = db;
                DataStorageService.bulkInsert(filename, json, res, close);
            });
        }
    },
    mongoCount: function (dataset, filename, res, cb) {
        if (!_.isNull(filename)) {
            DataStorageService.mongoConnect(dataset, filename, res, function (db) {
                var collection = db.collection(filename);
                collection.count({}, function (err, count) {
                    if (err) console.error(err);
                    db.close();
                    cb(count);
                });
            });
        }
    },
    mongoRename: function (dataset, filename, newfilename, res, cb) {
        if (!_.isNull(filename)) {
            DataStorageService.mongoConnect(dataset, filename, res, function (db) {
                var collection = db.collection(filename);
                collection.rename(newfilename);
                db.close();
            });
        }
    },
    deleteCollection: function (dataset, filename, res) {
        if (!_.isNull(filename)) {
            DataStorageService.mongoConnect(dataset, filename, res, function (db) {
                var collection = db.collection(filename);
                collection.drop(function (err, reply) {
                    if (err) console.error(err);
                    db.close();
                });
            });
        }
    },
    bulkInsert: function (filename, json, res, close) {
        var collection = bulkConnectionDb.collection(filename);
        collection.insertMany(json, {
            w: 1,
            ordered: false
        }, function (err) {
            if (err && !res.headersSent) return res.negotiate(err);
            if (close) {
                bulkConnectionDb.close();
                bulkConnectionDb = null;
            }
        });
    }
};