var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');
var fileinclude = require('gulp-file-include');
var prettify = require('gulp-html-prettify');

// --------------------------------------------------
// SASS
// --------------------------------------------------

gulp.task('sass', function () {
  return gulp
    .src('assets/source/scss/app.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(autoprefixer({
      browsers: [
        'last 3 versions',
        'ie > 10'
      ],
      cascade: false
    }))
    .pipe(gulp.dest('output/css'));
});

// --------------------------------------------------
// JS
// --------------------------------------------------

gulp.task('js', function () {
  return gulp
    .src([
      'assets/source/js/app.js',
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('output/js'));
});

gulp.task('scripts', ['js']);

// --------------------------------------------------
// Minify
// --------------------------------------------------

gulp.task('build', function () {
  return gulp
    .src([
      'output/js/app.js',
    ])
    .pipe(minify({
      ext: {
        src: '.js',
        min: '.min.js'
      },
    }))
    .pipe(gulp.dest('output/js'));
});

// --------------------------------------------------
// Font
// --------------------------------------------------

gulp.task('font', function () {
  return gulp
    .src([
      'assets/fonts/*',
    ])
    .pipe(gulp.dest('output/fonts'));
});

// --------------------------------------------------
// HTML
// --------------------------------------------------

gulp.task('html', function () {
  return gulp
    .src([
      'html/pages/*.html',
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('output'));
});

//Html beautifier
gulp.task('html-format', ['html'], function () {
  return gulp
    .src([
      'output/*.html',
    ])
    .pipe(prettify({indent_char: ' ', indent_size: 4}))
    .pipe(gulp.dest('output'));
});

// --------------------------------------------------
// IMAGE
// --------------------------------------------------

gulp.task('image', function () {
  return gulp
    .src([
      'assets/img/**/*',
    ])
    .pipe(gulp.dest('output/img'));
});

// --------------------------------------------------
// Task runners
// --------------------------------------------------

gulp.task('watch', function () {
  gulp.watch('assets/source/scss/**/*.scss', ['sass']);
  gulp.watch('assets/source/js/**/*.js', ['scripts']);
  gulp.watch('assets/fonts/*', ['font']);
  gulp.watch('html/**/*.html', ['html']);
});

gulp.task('default', ['sass', 'scripts', 'font', 'html', 'image']);
gulp.task('build', ['sass', 'scripts', 'font', 'image', 'html', 'html-format']);