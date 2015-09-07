/* jshint node: true */
'use strict';

var gulp = require('gulp');

/**
 * Paths
 * @type {Object}
 */
global.PATHS = {
  /** @type {Object} */
  src: {
    root: './src/'
  },
  /** @type {Object} */
  build: {
    root: './build/'
  }
};

// @access public
gulp.task('build', function () {
  return gulp.src(global.PATHS.src.root + '*.php')
    .pipe(gulp.dest(global.PATHS.build.root));
});

// Require the gulp folder with all the tasks, don't change this
require('./config/common/gulp');

// Add all the gruntfile tasks to gulp, don't change this
require('gulp-grunt')(require('gulp'));
