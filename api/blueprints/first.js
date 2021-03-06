const Response = require('../services/ResponseBuilderService');

module.exports = function(req, res) {

    var builder = new Response.ResponseGET(req, res, false);

    builder.firstQuery()
        .then(record => [
            record[0], {
                meta: builder.meta(record[0]),
                links: builder.links(record[0])
            }
        ])
        .spread(res.ok)
        .catch(res.negotiate);
};
