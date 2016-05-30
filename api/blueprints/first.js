const Response = require('../services/ResponseBuilderService');

module.exports = function (req, res) {

    var builder = new Response.ResponseQuery(req, res, 'createdAt ASC');

    builder.findQuery.exec(function (err, record) {
        if (err) return res.negotiate;

        return res.ok(record[0], {
            meta: builder.meta,
            links: builder.links
        });
    });

};
