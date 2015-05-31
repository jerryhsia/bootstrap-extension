'use strict';
var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rev = require('gulp-rev');

var app = {
  src: '',
  dist: 'dist/',
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

gulp.task('jshint', function () {
  return gulp.src(app.src + 'js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('less', function () {
  return gulp.src(app.src + 'less/bootstrap-extension.less')
    .pipe($.less())
    .pipe($.autoprefixer())
    .pipe(gulp.dest(app.src + 'css/'))
});

gulp.task('useref', ['less'], function () {
  var assets = $.useref.assets();
  return gulp.src(app.src + 'index.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.js', gulp.dest(dist())))
    .pipe($.if('*.css', gulp.dest(dist())))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.rename({suffix: '.min'})))
    .pipe($.if('*.js', gulp.dest(dist())))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.css', $.rename({suffix: '.min'})))
    .pipe($.if('*.css', gulp.dest(dist())))
    .pipe($.if('*.html', gulp.dest(dist())));
});

gulp.task('default', ['jshint', 'less', 'connect', 'watch']);

gulp.task('build', ['env:prod', 'jshint'], function() {
  return gulp.start('useref');
});

gulp.task('deploy', function() {
  return gulp.src(app.dist+'**/*')
    .pipe($.ghPages());
});
