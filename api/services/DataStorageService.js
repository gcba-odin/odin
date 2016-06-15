module.exports = {
    mongoSave: function(dataset, filename, json, res) {
        var MongoClient = require('mongodb').MongoClient;

        // Connect to the db
        MongoClient.connect("mongodb://" + sails.config.odin.filesDb.host + ":" +
            sails.config.odin.filesDb.port + "/" + dataset,
            function(err, db) {
                if (err && !res.headersSent) return res.negotiate(err);

                var collection = db.collection(filename);
                collection.insert(json, {
                    w: 1
                }, function(err) {
                    if (err && !res.headersSent) return res.negotiate(err)
                });
            });
    }
}