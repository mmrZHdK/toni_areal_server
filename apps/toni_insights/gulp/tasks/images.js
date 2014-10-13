var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = require('../config').paths;

gulp.task('images', function () {
    return gulp.src(paths.assets.img.folder + '/**/*.*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(paths.build.img))
        .pipe($.size());
});
