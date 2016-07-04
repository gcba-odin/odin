const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var winston = require('winston');

module.exports = {

    log: function(req, id, method) {
        //whiteliste check
        var model = actionUtil.parseModel(req);
        var target = model.adapter.identity;

        if (sails.config.odin.logWhitelist.indexOf(target) !== -1) {
            var user;
            user = (_.isUndefined(req.user) ? 'noUser' : req.user.id);

            if (_.isUndefined(id)) id = actionUtil.requirePk(req);
            var httpMethod = req.method;

            // on soft delete, must send method = delete.
            if (_.isUndefined(method)) {
                switch (httpMethod) {
                    case 'POST':
                        method = "create";
                        break;
                    case 'PATCH':
                        method = "update";
                        break;
                    case 'DELETE':
                        method = "delete";
                        break;
                }
            }

            Log.create({
                action: method,
                target: target,
                resource: id,
                user: user
            }).then(function created(created) {}).catch(function(err) {
                console.log('catch');
                throw new Error(err)
            });
        }
    },

    winstonLog: function(type, message, content) {
        console.log('inside winston log');

        // Attach context to the content
        var finalContent = {
            timestamp: Date.now()
        };
        for (var attribute in content) {
            if (content[attribute])
                finalContent[attribute] = content[attribute];
        }
        // Send the log
        winston.log(type, message, finalContent);
        console.log('end winston log');
        // winston.log('info', 'Now my debug messages are written to console!');
    }
};