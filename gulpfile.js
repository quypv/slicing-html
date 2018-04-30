var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');
var fileinclude = require('gulp-file-include');
var prettify = require('gulp-html-prettify');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');

// --------------------------------------------------
// SASS
// --------------------------------------------------

gulp.task('sass', function () {
  return gulp
    .src('assets/source/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()) // Using gulp-sass
    .pipe(autoprefixer({
      browsers: [
        'last 3 versions',
        'ie > 10'
      ],
      cascade: false
    }))
    .pipe(sourcemaps.write('./'))
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

gulp.task('minify-js', function () {
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

gulp.task('minify-css', function() {
  return gulp.src('output/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('output/css'));
});

gulp.task('minify', ['minify-js', 'minify-css']);

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
gulp.task('build', ['sass', 'scripts', 'font', 'image', 'html', 'minify', 'html-format']);