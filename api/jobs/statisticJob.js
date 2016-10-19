const moment = require('moment');
const jsonfile = require('jsonfile')
const path = require('path');
const _ = require('lodash');

module.exports = function(agenda) {
    var job = {

        // job name (optional) if not set,
        // Job name will be the file name or subfolder.filename (without .js)
        //name: 'Foo',

        // set true to disabled this job
        //disabled: false,

        // method can be 'every <interval>', 'schedule <when>' or now
        //frequency supports cron strings
        frequency: 'every 1 month',

        // Jobs options
        //options: {
        // priority: highest: 20, high: 10, default: 0, low: -10, lowest: -20
        //priority: 'highest'
        //},

        // Jobs data
        //data: {},

        // execute job

        run: function(job, done) {
            Statistic.find().exec(function(err, records) {
                if (err || _.isEmpty(records)) {
                    console.log(err);
                    done();
                } else {
                    firstRecord = _.head(records).createdAt;
                    lastRecord = _.last(records).createdAt;
                    json = {
                        "from": firstRecord,
                        "to": lastRecord,
                        "createdAt": new Date(),
                        "count": _.size(records),
                        "records:": records
                    };
                    firstRecordFormatted = moment(firstRecord).format("MM.DD.YYYY");
                    lastRecordFormatted = moment(lastRecord).format("MM.DD.YYYY");

                    var filename = firstRecordFormatted + '-' + lastRecordFormatted + '.json';

                    var file = path.join(sails.config.odin.statisticsPath, filename);

                    jsonfile.writeFile(file, json, function(err) {
                        console.log(err);
                    })

                    Statistic.destroy().exec(function(err) {
                        if (err) console.log(err);
                        done();
                    });
                }
            });
        }
    };
    return job;
};
