"use strict";

/**
 * OptionsController
 * @description :: Server-side logic for ...
 */
const Response = require('../services/ResponseBuilderService');

module.exports = {
    collection(req, res) {
        var builder = new Response.ResponseOPTIONS(req, res, true);

        var methods = OptionsMethodService.getMethods.collectionMethods();
        var meta = builder._meta;
        var data = builder.getMethods(methods);
        return res.options(data, meta);
        // return res.ok;
    },
    instance(req, res) {
        var builder = new Response.ResponseOPTIONS(req, res, false);
        builder._query.then(function(record, err) {
            if (_.isEmpty(record)) {
                return res.notFound();
            } else {
                var methods = OptionsMethodService.getMethods.instanceMethods();
                var meta = builder._meta;
                var data = builder.getMethods(methods);
                return res.options(data, meta);
            }
        });
    },

    query(req, res) {
        var builder = new Response.ResponseOPTIONS(req, res, true);

        var methods = OptionsMethodService.getMethods.queryMethods();

        var meta = builder._meta;
        var data = builder.getMethods(methods);
        return res.options(data, meta);
    }
};