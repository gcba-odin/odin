const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    log: function (req, id, method) {
        //whiteliste check
        var model = actionUtil.parseModel(req);

        var target = model.adapter.identity;

        if (sails.config.odin.logWhitelist.indexOf(target) != -1) {
            var user;
            _.isUndefined(req.user) ? user = 'noUser' : user = req.user.id;

            if (_.isUndefined(id)) id = actionUtil.requirePk(req);
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
            }).then(function created(created) {
            }).catch(function (err) {
                console.log('catch');
                throw new Error(err)
            });
        }
    }
};
