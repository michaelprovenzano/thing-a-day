const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack_stream = require('webpack-stream');
const webpack_config = require('./webpack.config');
const gls = require('gulp-live-server');

gulp.task('bundle', () => {
  return gulp
    .src(['./src/**', '!node_modules/**', '!./src/sass/**', '!./src/js/**', '!bin'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', () => {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('webpack', () => {
  return webpack_stream(webpack_config).pipe(gulp.dest('./dist/js'));
});

const bundle = () => {
  return gulp
    .src(['./src/**', '!node_modules/**', '!./src/sass/**', '!./src/js/**', '!bin'])
    .pipe(gulp.dest('./dist'));
};

const compileSass = () => {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'));
};

const compileJs = () => {
  return webpack_stream(webpack_config).pipe(gulp.dest('./dist/js'));
};

const liveServer = () => {
  var server = gls.static();
  server.start('dist', 8080);

  gulp.watch(['./dist/**/*.css', './dist/**/*.html', './dist/**/*.js'], function (file) {
    server.notify.apply(server, [file]);
  });
};

gulp.task('dev', () => {
  // watch for changes
  gulp.watch('./src/**/*.js', compileJs);
  gulp.watch('./src/**/*.scss', compileSass);
  gulp.watch('./src/**/*.html', bundle);
});

gulp.task('server', done => {
  liveServer();
  return done();
});

gulp.task('build', done => {
  compileJs();
  compileSass();
  bundle();
  return done();
});
