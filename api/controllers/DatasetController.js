"use strict";

/**
 * DatasetController
 * @description :: Server-side logic for ...
 */

module.exports = {
    download: function(req, res) {
        console.log('on download');
        const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
        const pk = actionUtil.requirePk(req);

        var path = sails.config.odin.uploadFolder + '/' + pk + '/dataset-' + pk + '.zip';

        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=dataset-' + pk + '.zip');

        var SkipperDisk = require('skipper-disk');
        var fileAdapter = SkipperDisk();
        fileAdapter.read(path).on('error', function(err) {
            return res.serverError(err);
        }).pipe(res);
    }
};