"use strict";

/**
 * OptionsController
 * @description :: Server-side logic for Options
 */
const Response = require('../services/ResponseBuilderService');

module.exports = {
    collection(req, res) {
        console.log('before builder1')

        var builder = new Response.ResponseOPTIONS(req, res, true);

        var methods = OptionsMethodService.getMethods.collectionMethods();
        var meta = builder._meta;
        var data = builder.getMethods(methods);
        return res.options(data, meta);
    },
    instance(req, res) {
        var builder = new Response.ResponseOPTIONS(req, res, false);
        builder._query.then(function(record, err) {
            if (err) return res.negotiate(err);
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
    },

    count(req, res) {
        var builder = new Response.ResponseOPTIONS(req, res, true);
        var methods = OptionsMethodService.getMethods.countMethods();
        var meta = builder._meta;
        var data = builder.getMethods(methods);
        return res.options(data, meta);
    },

    custom(req, res) {
        var builder = new Response.ResponseOPTIONS(req, res, true);
        var methodName = _.split(req.path, '/').pop() + 'Method';
        var methods = builder._model[methodName]();
        var meta = builder._meta;
        var data = builder.getMethods(methods);
        return res.options(data, meta);
    }
};