var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

/**
 * Styles
 */
gulp.task('sass-prod', function() {
  return gulp.src(paths.assets.sass.main)
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'compressed',
      compass: true
    }).on('error', $.notify.onError()))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest(paths.build.css))
    .pipe($.size());
});
