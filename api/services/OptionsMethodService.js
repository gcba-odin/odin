module.exports = {
    getMethods: {
        collectionMethods: function() {
            return {
                'GET': function(model) {
                    if (_.isUndefined(model.getAttributes))
                        return AttributesService.getAttributes(model);
                    else return model.getAttributes()
                },
                'POST': function(model) {
                    if (_.isUndefined(model.setAttributes))
                        return AttributesService.setAttributes(model);
                    else return model.setAttributes()

                },
                'HEAD': function(model) {
                    return {};
                },
                'OPTIONS': function(model) {
                    return {};
                }
            };
        },
        instanceMethods: function() {
            return {
                'GET': function(model) {
                    if (_.isUndefined(model.getAttributes))
                        return AttributesService.getAttributes(model);
                    else return model.getAttributes()
                },
                'PATCH': function(model) {
                    if (_.isUndefined(model.setAttributes))
                        return AttributesService.setAttributes(model);
                    else return model.setAttributes()

                },
                'DELETE': function(model) {
                    return {};
                },
                'HEAD': function(model) {
                    return {};
                },
                'OPTIONS': function(model) {
                    return {};
                }
            };
        },
        queryMethods: function() {
            return {
                'GET': function(model) {
                    if (_.isUndefined(model.getAttributes))
                        return AttributesService.getAttributes(model);
                    else return model.getAttributes()
                },
                'HEAD': function(model) {
                    return {};
                },
                'OPTIONS': function(model) {
                    return {};
                }
            };
        }
    },
    getHeaders: function(method) {
        var headers = {
            'Authorization': 'JWT [token]',
            'Accept': 'application/json'
        };

        return headers;
    }
};