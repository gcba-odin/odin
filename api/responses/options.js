"use strict";

module.exports = function (data, meta) {
    const response = _.assign({
        meta: meta,
        data: data
    });
    console.log('response es + ' + JSON.stringify(response));
    // // Add headers to the res object as needed
    this.res.status(200);
    this.res.jsonx(response);
};

