const Response = require('../services/ResponseBuilderService');

module.exports = function(req, res) {

    var builder = new Response.ResponseQuery(req, res, 'createdAt ASC');

    builder.findQuery
        .then(record => record[0] = [
            record[0], {
                meta: builder.meta(undefined),
                links: builder.links(undefined)
            }
        ])
        .spread(res.ok)
        .catch(res.negotiate);
};