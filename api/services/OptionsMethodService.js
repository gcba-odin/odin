module.exports = {
    getMethods: {
        collectionMethods: function() {
            return {
                'GET': function(model) {
                    if (_.isUndefined(model.getAttributes))
                        return AttributesService.getAttributes(model);
                    else return model.getAttributes();
                },
                'POST': function(model) {
                    if (_.isUndefined(model.setAttributes))
                        return AttributesService.setAttributes(model);
                    else return model.setAttributes();

                },
                'HEAD': function() {
                    return {};
                },
                'OPTIONS': function() {
                    return {};
                }
            };
        },
        instanceMethods: function() {
            return {
                'GET': function(model) {
                    if (_.isUndefined(model.getAttributes))
                        return AttributesService.getAttributes(model);
                    else return model.getAttributes();
                },
                'PATCH': function(model) {
                    if (_.isUndefined(model.setAttributes))
                        return AttributesService.setAttributes(model);
                    else return model.setAttributes();

                },
                'DELETE': function() {
                    return {};
                },
                'HEAD': function() {
                    return {};
                },
                'OPTIONS': function() {
                    return {};
                }
            };
        },
        queryMethods: function() {
            return {
                'GET': function(model) {
                    if (_.isUndefined(model.getAttributes))
                        return AttributesService.getAttributes(model);
                    else return model.getAttributes();
                },
                'HEAD': function() {
                    return {};
                },
                'OPTIONS': function() {
                    return {};
                }
            };
        },
        countMethods: function() {
            return {
                'GET': function() {
                    return AttributesService.countAttributes();
                },
                'HEAD': function() {
                    return {};
                },
                'OPTIONS': function() {
                    return {};
                }
            };
        }
    },
    getHeaders: function() {
        var headers = {
            'Authorization': 'JWT [token]',
            'Accept': 'application/json'
        };

        return headers;
    }
};