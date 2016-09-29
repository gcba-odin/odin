"use strict";

module.exports = {
    /*
     * Syncs all SOAP and REST services by update frequency
     */
    sync: function(updateFrequency, callback){
        File.find({
            updateFrequency: updateFrequency.id,
            or: [ { soapService: {'!': null} },  { restService: {'!': null} }]
        }).exec(function(err, files) {
            if (err) return callback(err, files);

            files.forEach(function(file) {
                if(file.restService) {
                    //RestService.getData(file.restService, function(err, result){
                    //    console.log(err);
                    //    console.log(result);
                    //});
                }
                else if(file.soapService) {
                    //SoapService.getData(file.soapService, function(err, result){
                    //    console.log(err);
                    //    console.log(result);
                    //});
                }
            });           

            //For now, returning files
            return callback(err, files);
            
        });
    },
}