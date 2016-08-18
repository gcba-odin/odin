var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('dredd',
    shell.task(
        ['dredd odin.apib http://localhost:30000 --hookfiles=dredd.js'], {
            verbose: true,
            ignoreErrors: true
        })
);

gulp.task('default', ['watch']);

gulp.task('watch', function() {
    gulp.watch('odin.apib', ['dredd']);
});