var gulp = require('gulp');
var concat = require('gulp-concat');
var brfs = require('gulp-brfs');
var fs = require('fs');

gulp.task('default', function () {
	gulp.src('./sketches/**/*.js')
		.pipe(concat('main.js'))
		.pipe(brfs())
		.pipe(gulp.dest('./js/'));
});

gulp.task('watch', ['default'], function () {
	gulp.watch('sketches/**/*', ['default']);
})