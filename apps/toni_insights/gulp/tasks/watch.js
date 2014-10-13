var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

gulp.task('watch', ['setWatch', 'browserify'], function () {
    gulp.watch([
        paths.assets.js.folder + '/**/*.js',
        '!assets/js/{vendor, vendor/**}'],
        ['jshint']
    );
    gulp.watch(paths.assets.sass.folder + '/**/*.scss', ['sass-dev']);
    gulp.watch(paths.assets.img.folder + '/**/*', ['images']);
});
