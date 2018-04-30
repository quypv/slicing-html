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
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var clean = require('gulp-clean');

// --------------------------------------------------
// SASS
// --------------------------------------------------

gulp.task('sass', ['clean-css'], function () {
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

gulp.task('js-vendor', ['clean-js'], function () {
  return gulp
    .src([
      'assets/source/lib/jquery/jquery-3.0.0.js',
      'assets/source/lib/bootstrap-4.1.0/js/bootstrap.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('output/js'));
});

gulp.task('js', ['clean-js'], function () {
  return gulp
    .src([
      'assets/source/js/app.js',
      'assets/source/js/home.js',
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('output/js'));
});

gulp.task('js-standalone', ['clean-js'], function () {
  return gulp
    .src([
      'assets/source/js/standalone/**/*',
    ])
    .pipe(gulp.dest('output/js/standalone'));
});

gulp.task('js-lint', ['js'], function() {
  return gulp.src('assets/source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish));
});

gulp.task('scripts', ['js-vendor', 'js', 'js-lint', 'js-standalone']);

// --------------------------------------------------
// Minify
// --------------------------------------------------

gulp.task('minify-js', ['scripts'], function () {
  return gulp
    .src([
      'output/js/vendor.js',
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

gulp.task('minify-css', ['sass'], function() {
  return gulp.src([
    'output/css/*.css',
    '!output/css/*.min.css',
  ])
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

gulp.task('font', ['clean-font'], function () {
  return gulp
    .src([
      'assets/fonts/**/*',
    ])
    .pipe(gulp.dest('output/fonts'));
});

// --------------------------------------------------
// HTML
// --------------------------------------------------

gulp.task('html', ['clean-html'], function () {
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

gulp.task('image', ['clean-image'], function () {
  return gulp
    .src([
      'assets/img/**/*',
    ])
    .pipe(gulp.dest('output/img'));
});

// --------------------------------------------------
// Clean
// --------------------------------------------------
gulp.task('clean-css', function () {
  return gulp.src('output/css', {read: false})
      .pipe(clean());
});

gulp.task('clean-js', function () {
  return gulp.src('output/js', {read: false})
      .pipe(clean());
});

gulp.task('clean-font', function () {
  return gulp.src('output/fonts', {read: false})
      .pipe(clean());
});

gulp.task('clean-image', function () {
  return gulp.src('output/img', {read: false})
      .pipe(clean());
});

gulp.task('clean-html', function () {
  return gulp.src('output/*.html', {read: false})
      .pipe(clean());
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