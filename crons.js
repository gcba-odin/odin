const CronJob = require('cron').CronJob;
var Sails = require('sails');
var fs = require('fs');
var slug = require('slug');
var _ = require('lodash');
var sem = require('semaphore')(1);

Sails.load(require('rc')('sailscron'), function(err, sails) {

    // Update WebServices
    UpdateFrequency.find().then((updateFrequencies) => {
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

    // Queue of files to parse
    // new CronJob('0 30 2 * * *', function() {
        new CronJob('0 */1 * * * *', function() {
        // crons = () => {
        // get all unfinished jobs, order by the date they were created
        FileJob.find({finish: false}).sort('priority').sort('createdAt').then((jobs) => {
            console.log('Jobs queued: ', jobs)
            _.forEach(jobs, function(job) {
                sem.take(function() {
                    File.findOne(job.file).populate('dataset').then((file) => {

                        // If the file is new, no collection was created
                        if (job.new === false) {
                            DataStorageService.deleteCollection(file.dataset.id, file.fileName, (err) => console.log(err));
                        }

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
                                    sem.leave();
                                })
                            })
                        } else {
                            UploadService.csvToJson(file.dataset.id, file, readStream, (err, data) => {
                                if (err) {
                                    console.log('csvtojson err');
                                    console.log(err)
                                }
                                FileJob.update(job, {
                                    finish: true,
                                    endDate: new Date()
                                }).then((updatedJob) => {
                                    console.log(updatedJob)
                                    console.log('job updated')
                                    sem.leave();
                                }).catch((err) => console.log('error on job update', err))
                            })
                        }
                    })
                })
            })
        })
    }, null, true);

});
