"use strict";

/**
 * OptionsController
 * @description :: Server-side logic for ...
 */
const Response = require('../services/ResponseBuilderService');

module.exports = {
    collection(req, res) {
        var methods = OptionsMethodService.getMethods.collectionMethods();
        var builder = new Response.ResponseOPTIONS(req, res, methods);
        var meta = builder._meta;
        var data = builder._data;
        return res.options(data, meta);
        // return res.ok;
    },
    instance(req, res) {
        var methods = OptionsMethodService.getMethods.instanceMethods();
        var builder = new Response.ResponseOPTIONS(req, res, methods);
        var meta = builder._meta;
        var data = builder._data;
        return res.options(data, meta);
    },

    query(req, res) {
        var methods = OptionsMethodService.getMethods.queryMethods();
        var builder = new Response.ResponseOPTIONS(req, res, methods);
        var meta = builder._meta;
        var data = builder._data;
        return res.options(data, meta);
    }
};