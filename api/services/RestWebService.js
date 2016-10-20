"use strict";

/*
 This service gets data from a REST service and parse it into saveable data
 */

var requestify = require('requestify');
var parseString = require('xml2js').parseString;
const _ = require('lodash');

module.exports = {
    getData: function(restService, callback) {

        // Object where all the rest web service options will be stored
        var requestOptions = {};

        // General parameters
        requestOptions.params = restService.parameters;

        // username and password
        if (restService.username && restService.password) {
            requestOptions.auth = {
                username: restService.username,
                password: restService.password
            };
        }

        // if token is set, we add it to the options
        if (restService.token) {
            requestOptions.headers = {
                Authorization: restService.token
            }
        }

        // make the call to the defined url, sending the parameters made
        requestify.get(restService.url, requestOptions).then(function(response) {
            // if is xml we parse it
            if (response.body.indexOf("<?xml") != -1) {
                var options = {
                    ignoreAttrs: true,
                    explicitArray: false
                };
                parseString(response.body, options, function(err, result) {
                    // To get the route to the data
                    if (err) return callback(err, null);

                    result = result[restService.dataPath];
                    return callback(null, result);
                })
            }
            // if is json directly return it
            else {
                response = response.getBody();
                response = JSON.parse(response);
                return callback(null, _.isUndefined(restService.dataPath) ? response : response[restService.dataPath]);
            }
        });
    }
};
