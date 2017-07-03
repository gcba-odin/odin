const CronJob = require('cron').CronJob;
var Sails = require('sails');
var fs = require('fs');
var slug = require('slug');
var _ = require('lodash');

Sails.load(require('rc')('sails'), function(err, sails) {
    UpdateFrequency.find(function(err, updateFrequencies) {
        //We should run a cron job per update frequency
        updateFrequencies.forEach(function(updateFrequency) {
            try {
                if (updateFrequency.timePattern) {
                    new CronJob(updateFrequency.timePattern, function() {
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
new CronJob('*/10 * * * * *', function() {
    // get all unfinished jobs, order by the date they were created
    FileJob.find({finish: false}).sort('priority').sort('createdAt').then((jobs) => {
        console.log(jobs)
        _.forEach(jobs, function(job) {
            File.findOne(job.file).populate('dataset').then((file) => {
                var dirname = sails.config.odin.uploadFolder + "/" + slug(file.dataset.name, {lower: true}) + '/' + file.fileName;

                var readStream = fs.createReadStream(dirname);

                var extension = file.fileName.split('.').pop();

                if (extension === 'xls' || extension === 'xlsx') {
                    file.dataset = file.dataset.id
                    UploadService.xlsToJson(file, readStream, dirname, (err, data) => {
                        if (err)
                            console.log(err)
                        FileJob.update(job, {
                            finish: true,
                            endDate: new Date()
                        }, (err, updatedJob) => {
                            console.log(err)
                            console.log(updatedJob)
                            console.log('job updated')
                        })
                    })
                } else {
                    UploadService.csvToJson(file.dataset.id, file, readStream, (err, data) => {
                        if (err)
                            console.log(err)
                        FileJob.update(job, {
                            finish: true,
                            endDate: new Date()
                        }).then((updatedJob) => {
                            console.log(updatedJob)
                            console.log('job updated')
                        }).catch((err) => console.log('error on job update', err))
                    })
                }
            })
        })
    })
}, null, true);

saveFileJob = (data) => {}
