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

gulp.task('scripts-minify', function() {
  return gulp.src(paths.build.js + '/app.js')
    .pipe($.concat(paths.build.scriptsNameMin))
    .pipe($.uglify())
    .pipe(gulp.dest(paths.build.js))
});
