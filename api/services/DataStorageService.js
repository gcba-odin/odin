const MongoClient = require('mongodb').MongoClient;
const _ = require('lodash');
var bulkConnectionDb;

module.exports = {

    mongoConnect: function(dataset, filename, cb) {
        // Connect to the db
        MongoClient.connect("mongodb://" + sails.config.odin.dataStorage.host + ":" + sails.config.odin.dataStorage.port + "/" + dataset, function(err, db) {
            if (err)
                return cb(err);
            cb(null, db);
        });
    },
    mongoSave: function(dataset, filename, json, cb) {
        json = _.transform(json, function(result, each) {
            result.push(_.mapKeys(each, function(value, key) {
                return _.replace(key, ".", " ");
            }));
        }, [])
        DataStorageService.mongoConnect(dataset, filename, function(err, db) {
            if (err)
                return cb(err)
            var collection = db.collection(filename);
            collection.insert(json, {
                w: 1
            }, function(err) {
                if (err)
                    return cb(err);
                db.close();
                cb(null, true)
            });
        });
    },
    mongoCount: function(dataset, filename, cb) {
        if (!_.isNull(filename)) {
            DataStorageService.mongoConnect(dataset, filename, function(err, db) {
                if (err)
                    return cb(err)
                var collection = db.collection(filename);
                collection.count({}, function(err, count) {
                    if (err)
                        console.error(err);
                    db.close();
                    cb(null, count);
                });
            });
        }
    },
    mongoRename: function(dataset, filename, newfilename, cb) {
        if (!_.isNull(filename)) {
            DataStorageService.mongoConnect(dataset, filename, function(err, db) {
                if (err)
                    return cb(err)
                var collection = db.collection(filename);
                collection.rename(newfilename).then(() => db.close());
                // db.close();
            });
        }
    },
    mongoReplace: function(oldDataset, newDataset, oldFilename, newFilename, cb) {
        return DataStorageService.mongoContents(oldDataset, oldFilename, 0, 0, function(err, json) {
            if (err)
                return cb(err)

            this.deleteCollection(oldDataset, oldFilename, (err) => {
                if (err)
                    return cb(err)
            });
            this.mongoSave(newDataset, newFilename, json, (err, finished) => {
                if (err)
                    return cb(err)
                if (finished)
                    return cb(null, finished)
            })
        }.bind(this))

    },
    deleteCollection: function(dataset, filename, cb) {
        if (!_.isNull(filename)) {
            DataStorageService.mongoConnect(dataset, filename, function(err, db) {
                if (err)
                    return cb(err)
                var collection = db.collection(filename);
                collection.drop(function(err, reply) {
                    if (err)
                        console.error(err);
                    db.close();
                });
            });
        }
    },
    // TODO: should this be donde with streams?
    mongoContents: function(dataset, filename, limit, skip, cb) {
        DataStorageService.mongoConnect(dataset, filename, function(err, db) {
            if (err)
                return cb(err)
            var data = [];

            var collection = db.collection(filename);
            var cursor = collection.find().skip(skip).limit(limit);

            cursor.each(function(err, doc) {
                if (err)
                    console.error(err);
                if (doc !== null) {
                    data.push(doc);
                } else {
                    db.close();
                    return cb(null, data);
                }
            });
        });
    }
};
