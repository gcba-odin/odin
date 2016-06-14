const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {
    log: function (req, id, method) {
        console.log('inside log function');
        //whiteliste check
        var user;
        _.isUndefined(req.user) ? user = '' : user = req.user.id;

        if (_.isUndefined(id)) id = actionUtil.requirePk(req);
        var model = actionUtil.parseModel(req);
        var target = model.adapter.identity;
        var httpMethod = req.method;
        var action = '';
        // on soft delete, must send method = delete.
        if (_.isUndefined(method)) {
            switch (httpMethod) {
                case 'POST':
                    action = "create";
                    break;
                case 'PATCH':
                    action = "update";
                    break;
                case 'DELETE':
                    action = "delete";
                    break;
            }
        }
        Log.create({
            action: action,
            target: target,
            resource: id,
            user: user
        }).exec(function created(err, created) {
            if (err) return res.negotiate(err);
            console.log(JSON.stringify(created));
        });
    }
};
