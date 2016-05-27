"use strict";

/**
 * OptionsController
 * @description :: Server-side logic for ...
 */
const Response = require('../services/ResponseBuilderService');

module.exports = {
    collection(req, res) {
        var methods = OptionsMethodsService.getMethods.collectionMethods();
        var builder = new Response.ResponseOPTIONS(req,res,methods);
        var meta = builder.meta;
        var data = builder.data;
        return res.options(data,meta);
        // return res.ok;
    },
    // instance(req, res) {
    //     var model = actionUtil.parseModel(req);
    //     var id = req.param('id');
    //     if (id) {
    //         model.findOne({id: id}).exec(function (err, record) {
    //             if (err) return res.negotiate(err);
    //             if (!record) return res.notFound();
    //             else {
    //                 var methods = (OptionsMethodsService.getMethods.instanceMethods());
    //                 // Key has the function that returns the parameters & value has the HTTP verb
    //                 _.forEach(methods, function (key, value) {
    //                     console.log(key(model));
    //                 });
    //                 return res.ok();
    //             }
    //         });
    //     }
    //     return res.ok;
    // },
    // count(req, res) {
    //     var model = actionUtil.parseModel(req);
    //     var methods = (OptionsMethodsService.getMethods.queryMethods());
    //     // Key has the function that returns the parameters & value has the HTTP verb
    //     _.forEach(methods, function (key, value) {
    //         console.log(key(model));
    //     });
    //     return res.ok;
    // },
    // query(req, res) {
    //     var model = actionUtil.parseModel(req);
    //     var methods = (OptionsMethodsService.getMethods.queryMethods());
    //     // Key has the function that returns the parameters & value has the HTTP verb
    //     _.forEach(methods, function (key, value) {
    //         console.log(key(model));
    //     });
    //     return res.ok;
    // }
};
