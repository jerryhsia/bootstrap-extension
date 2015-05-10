'use strict';
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var app = {
  src: '',
  bower: 'bower_components/',
  dist: 'dist/',
  tmp: '.tmp/',
  env: 'dev'
};

function dist() {
  return app.env == 'dev' ? app.src : app.dist
}

gulp.task('env:prod', function () {
  app.env = 'prod';
});

gulp.task('reload', function () {
  gulp.src(app.src + '*.html')
    .pipe($.connect.reload());
});

gulp.task('watch', function () {
  gulp.watch([app.src + 'less/**/*.less'], ['less', 'reload']);
  gulp.watch([app.src + '*.html'], ['reload']);
});

gulp.task('connect', function () {
  $.connect.server({
    root: app.env == 'dev' ? __dirname : app.dist,
    port: 4000,
    livereload: true
  });
});

gulp.task('less', function () {
  return gulp.src(app.src + 'less/bootstrap-extension.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(app.src + 'css/'))
});

gulp.task('default', ['less', 'connect', 'watch']);
