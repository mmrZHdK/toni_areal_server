var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

/**
 * Styles
 */
gulp.task('sass-dev', function() {
  return gulp.src(paths.assets.sass.main)
    .pipe($.plumber())
    .pipe($.rubySass({
      style: 'expanded',
      compass: false
    }).on('error', $.notify.onError()))
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest(paths.build.css))
    /*.pipe($.rev())
    .pipe(gulp.dest(paths.build.cssTemp))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(paths.build.cssTemp))*/
    .pipe($.size());
});
