var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

/**
 * Scripts
 */
gulp.task('scripts-dev', function() {
  return gulp.src(paths.assets.js.main)
    .pipe($.concat(paths.build.scriptsName))
    .pipe(gulp.dest(paths.build.js))
    .pipe($.size());
});
