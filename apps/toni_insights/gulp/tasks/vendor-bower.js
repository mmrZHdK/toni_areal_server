var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

gulp.task('vendor-bower', function() {
  return gulp.src(paths.assets.js.bower)
    .pipe($.concat(paths.build.bowerName))
    //.pipe($.uglify())
    .pipe(gulp.dest(paths.build.js))
    .pipe($.size());
});
