var gulp = require('gulp');
var mustache = require('gulp-mustache');
var babel = require('gulp-babel');
var _ = require('lodash');
var globby = require('globby');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var concat = require('gulp-concat');
var del = require('del');

var CONFIG = require('./config.js');
var THIRD_PARTY_SCRIPT_INFO = require('./frontend/lib-info/scripts.json');
var THIRD_PARTY_CSS_INFO = require('./frontend/lib-info/css.json');
var NG_SUFFIXES = [
  'service',
  'controller',
  'filter',
  'directive',
  'provider'
];

gulp.task('compile-js', () => {
  return gulp.src(getAppScripts())
    // .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('wiregoose.js'))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('frontend/app/'));
});

gulp.task('compile-less', function () {
  return gulp.src('frontend/app/less/app.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: ['frontend/app/bower_components/', 'frontend/app/less', 'frontend/app']
    }))
    .pipe(concat('wiregoose.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('frontend/app/'));
});

gulp.task('compile-index', function () {
  return gulp.src('frontend/app/index.mustache')
    .pipe(mustache(getIndexArgs(), {extension: '.html'}))
    .pipe(gulp.dest('frontend/app'));
});

gulp.task('compile', function (cb) {
  runSequence(['compile-js', 'compile-less', 'compile-index'], cb);
});

gulp.task('serve-dev', ['compile'], function() {
  browserSync({
    port: 8000,
    server: {
      baseDir: 'frontend/app'
    }
  });

  gulp.task('reload', ['compile-index'], function (cb) {
    browserSync.reload();
    cb();
  });

  gulp.watch('frontend/app/**/*.less', ['compile-less']);
  gulp.watch('frontend/app/**/*.js', ['compile-js']);

  gulp.watch(['frontend/app/wiregoose.js', 'frontend/app/**/*.html'], ['reload']);
  
  gulp.watch('frontend/app/wiregoose.css', function () {
    gulp.src('frontend/app/wiregoose.css')
      .pipe(browserSync.reload({stream: true}));
  });
  gulp.watch('frontend/app/index.mustache', ['compile-index']);
});

gulp.task('default', ['compile']);

function getIndexArgs() {
  var indexArgs = {
    stripBase: _.constant(stripBase),
    thirdPartyScripts: THIRD_PARTY_SCRIPT_INFO.map(_.property('path')),
    thirdPartyCss: THIRD_PARTY_CSS_INFO.map(_.property('path')),
    appCss: 'wiregoose.css',
    appScript: 'wiregoose.js',
    config: CONFIG 
  };
  return indexArgs;
}

function stripBase(text, render) {
  text = render(text);
  if (text.indexOf('frontend/app') === 0) {
    text = text.substr('frontend/app'.length);
  }
  if (text.indexOf('/') === 0) {
    text = text.substr('/'.length);
  }
  return text;
}

function getAppScripts() {
  return globby.sync([
    '{frontend/app,frontend/app/!(bower_components)/**}/*.js',
    '!{frontend/app,frontend/app/!(bower_components)/**}/*{' + NG_SUFFIXES.join(',') + '}.js',
    '!frontend/app/wiregoose.js'
  ])
  .concat(globby.sync([
    '{frontend/app,frontend/app/!(bower_components)/**}/*{' + NG_SUFFIXES.join(',') + '}.js',
    '!frontend/app/wiregoose.js'
  ]));
}