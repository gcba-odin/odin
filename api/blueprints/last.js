const Response = require('../services/ResponseBuilderService');

module.exports = function(req, res) {

    var builder = new Response.ResponseQuery(req, res, 'createdAt DESC');

    builder.findQuery
        .then(record => record[0] = [
            record[0], {
                meta: builder.meta(),
                links: builder.links(record[0])
            }
        ])
        .spread(res.ok)
        .catch(res.negotiate);
};