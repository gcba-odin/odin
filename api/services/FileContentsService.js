var MongoClient = require('mongodb').MongoClient;

module.exports = {
    mongoContents: function(dataset, filename, limit, skip, res, cb) {

        // Connect to the db
        MongoClient.connect("mongodb://" + sails.config.odin.filesDb.host + ":" +
            sails.config.odin.filesDb.port + "/" + dataset,
            function(err, db) {
                var data = [];

                if (err && !res.headersSent) return res.negotiate(err);

                var collection = db.collection(filename);
                var cursor = collection.find().skip(skip).limit(limit);

                cursor.each(function(err, doc) {
                    if (err) console.error(err);

                    if (doc !== null) {
                        data.push(doc);
                    } else {
                        return cb(data);
                    }
                });
            });
    }
}