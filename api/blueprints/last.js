const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = function (req,res){
    var model = actionUtil.parseModel(req);

    model.find({ limit: 1, sort: "createdAt DESC" }).exec(function (err,record){
        if (err) return res.negotiate;
        return res.ok(record);
    });
};
