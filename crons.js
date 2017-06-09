const CronJob = require('cron').CronJob;
var Sails = require('sails');
var fs = require('fs');
var _ = require('lodash');

Sails.load(require('rc')('sails'), function(err, sails) {
    UpdateFrequency.find(function(err, updateFrequencies) {
        //We should run a cron job per update frequency
        updateFrequencies.forEach(function(updateFrequency) {
            try {
                if (updateFrequency.timePattern) {
                    new CronJob(updateFrequency.timePattern, function() {
                        console.log('cron executed', updateFrequency.timePattern)
                        WebService.syncByUpdateFrequency(updateFrequency);
                    }, null, true);
                }
            } catch (ex) {
                console.log("cron pattern not valid");
            }
        });
    });
});

// new CronJob('0 30 2 * * *', function() {
new CronJob('*/5 * * * * *', function() {
    // get all unfinished jobs, order by the date they were created
    fileJobs.find({ended: false}).sort('createdAt').then((jobs) => {
        console.log(jobs)
        _.forEach(jobs, function(job) {
            File.findOne(job.fileId).populate('dataset').then((file) => {
                var dirname = sails.config.odin.uploadFolder + "/" + slug(file.dataset.name, {lower: true}) + '/' + file.fileName;
                var readStream = fs.createReadStream(dirname);
                if (extension === 'xls' || extension === 'xlsx') {
                    UploadService.xlsToJson((data) => {
                        fileJobs.update(job, {
                            finish: true,
                            endDate: Date.now
                        }, (updatedJob) => {
                            console.log('job updated')
                        })
                    }, dataset, data, res, readStream, true, dirname)
                } else {
                    UploadService.csvToJson((data) => {
                        fileJobs.update(job, {
                            finish: true,
                            endDate: Date.now
                        }, (updatedJob) => {
                            console.log('job updated')
                        })
                    }, file.dataset, file, res, readStream, true)
                }
            })
        })
    })
}, null, true);

saveFileJob = (data) => {}
