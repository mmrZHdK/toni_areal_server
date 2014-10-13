var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

/**
 * jsHint
 *
 * hint all *.js files
 * - exclude *.vendor.js files
 * - exclude files in folder vendor/
 */
gulp.task('jshint', function() {
  return gulp.src(
      [
        paths.assets.js.folder + '/**/*.js',
        '!' + paths.assets.js.folder + '/**/*.vendor.js',
        '!' + paths.assets.js.vendor + '/**/*.js'
      ]
    )
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
});
