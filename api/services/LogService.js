const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
const _ = require('lodash');
const winston = require('winston');

module.exports = {

    log: function(req, id, method) {
        //whiteliste check
        var model = actionUtil.parseModel(req);
        var target = model.adapter.identity;
        Config.find({
            key: 'logWhitelist'
        }).exec(function(err, whitelist) {
            if (err) throw new Error(err);
            whitelistArray = _.split(whitelist[0].value, ',');

            if (whitelistArray.indexOf(target) !== -1) {
                var user = (_.isUndefined(req.user) ? 'noUser' : req.user.id);

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
                        case 'PUT':
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
                }).then(function created() {}).catch(function(err) {
                    throw new Error(err);
                });
            }
        });

    },

    winstonLog: function(type, message, content) {
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
    },
    winstonLogResponse: function(message, metaCode, metaMessage, headers, body, ip) {

        LogService.winstonLog('verbose', message, {
            ip: ip,
            code: metaCode,
            message: metaMessage
        });

        LogService.winstonLog('silly', message, {
            ip: ip,
            headers: headers,
            body: body
        });

    }
};
