module.exports = {
    getMethods: {
        collectionMethods: function() {
            return {
                'GET': function(model) {
                    return model.getAttributes();
                },
                'POST': function(model) {
                    return model.setAttributes();
                },
                'HEAD': function(model) {
                    return {};
                },
                'OPTIONS': function(model) {
                    return {};
                }
            }
        },
        instanceMethods: function() {
            return {
                'GET': function(model) {
                    return model.getAttributes();
                },
                'PATCH': function(model) {
                    return model.setAttributes();
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
            }
        },
        queryMethods: function() {
            return {
                'GET': function(model) {
                    return model.getAttributes();
                },
                'HEAD': function(model) {
                    return {};
                },
                'OPTIONS': function(model) {
                    return {};
                }
            }
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