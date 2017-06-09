"use strict";

module.exports = {
    syncByFileId: function(fileId) {
        File.find({
            id: fileId
        })
        .populate(['dataset', 'soapService', 'restService'])
        .exec(function(err, files) {
            if (err) return console.log(err);
            WebService.sync(files);
        });
    },

    /*
     * Syncs all SOAP and REST services by update frequency
     */
    syncByUpdateFrequency: function(updateFrequency) {
        File.find({
            updateFrequency: updateFrequency.id,
            or: [ { soapService: {'!': null} },  { restService: {'!': null} }]
        })
        .populate(['dataset', 'soapService', 'restService'])
        .exec(function(err, files) {
            if (err) return console.log(err);
            try {
                WebService.sync(files);
            } catch(err) {
                console.log(err);
            }
        });
    },

    sync: function(files){
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
                        UploadService.uploadServiceFile(file, result, function(err, uploadedFile){
                            //console.log(err);
                            //console.log(uploadedFile);
                        });
                    }
                });
            }
        });
    }
}
