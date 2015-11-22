var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function () {
	gulp.src('./sketches/**/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./js/'));
});

gulp.task('watch', ['default'], function () {
	gulp.watch('sketches/**/*.js', ['default']);
})