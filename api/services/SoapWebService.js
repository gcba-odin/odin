"use strict";

/*
 This service gets data from a SOAP service and parse it into saveable data
 */

var soap = require('soap');

module.exports = {
    getData: function (soapService, callback) {
    	try {
        	soap.createClient(soapService.url, function (err, client) {
				var serviceAction = client[soapService.method];
				serviceAction(soapService.parameters, callback);
        	});
        } catch(err) {
            callback(err, null);
        }
    }
};
