"use strict";

/**
 * HeadController
 * @description :: Server-side logic for ...
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const takeAlias = _.partial(_.map, _, item => item.alias);

module.exports = {
    head(req, res) {
        // const fields = req.param('fields') ? req.param('fields').replace(/ /g, '').split(',') : [];
        var model = actionUtil.parseModel(req);
        var id = req.param('id');
        if (id) {
            model.findOne({id: id}).exec(function (err,record){
                if (err) return res.negotiate(err);
                if (!record) return res.notFound();
                else return res.ok();
                });
        }
        // const where = actionUtil.parseCriteria(req);
        // const query = model.find(null, fields.length > 0 ? {select: fields} : null).where(where).limit(limit).skip(skip).sort(sort);
        // const findQuery = _.reduce(_.intersection(populate, takeAlias(model.associations)), populateAlias, query);
        // console.log(fields);
        // console.log(where);
        // console.log(query);
        // console.log(findQuery);
    }
};
