var gulp = require('gulp');

gulp.task('build-dev', ['sass-dev', 'jshint', 'scripts-dev', 'vendor-bower', 'images']);
