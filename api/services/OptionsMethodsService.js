module.exports = {
    collectionMethods: function () {
        return {
            'GET': 'readAttributes',
            'POST': 'writeAttributes',
            'HEAD': 'noneAttributes',
            'OPTIONS': 'noneAttributes'
        }
    },

    instanceMethods: function () {
        //TODO: Similar to collectionMethods()
        return ['GET,PATCH,DELETE,HEAD,OPTIONS']
    }
    ,
    queryMethods: function () {
        return ['GET, HEAD, OPTIONS']
    }
}
;
