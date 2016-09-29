"use strict";

/*
 This service gets data from a SOAP service and parse it into saveable data
 */

var soap = require('soap');

module.exports = {
    getData: function (soapService, callback) {
        soap.createClient(soapService.url, function (err, client) {
          client[soapService.method](args, callback);
        });
    }
};
