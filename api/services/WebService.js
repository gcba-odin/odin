"use strict";

module.exports = {
    /*
     * Syncs all SOAP and REST services by update frequency
     */
    sync: function(updateFrequency){
        File.find({
            updateFrequency: updateFrequency.id,
            or: [ { soapService: {'!': null} },  { restService: {'!': null} }]
        })
        .populate(['dataset', 'soapService', 'restService'])
        .exec(function(err, files) {    
            if (err) return console.log(err);
            files.forEach(function(file) {
                if(file.restService) {
                    RestWebService.getData(file.restService, function(err, result){
                        //TODO: Persist cron history
                        if(err) {
                            console.log(err);
                        }
                        else{
                            UploadService.uploadServiceFile(file, result, function(err, uploadedFile){
                                //console.log(err);
                                //console.log(uploadedFile);
                            });    
                        }
                    });
                }
                else if(file.soapService) {
                    SoapWebService.getData(file.soapService, function(err, result){
                        if(err) {
                            console.log(err);
                        }
                        else{
                            console.log(result);    
                        }
                    });
                }
            });
        });
    },
}