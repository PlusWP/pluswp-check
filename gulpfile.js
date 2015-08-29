/* jshint node: true */
'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');

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

// @private
gulp.task('_build-prepare', sequence([
  '_build-clean',
  '_build-copy'
]));

// @public
gulp.task('build', ['_build-prepare'], sequence([
  '_build-create-index',
  'grunt-lang'
]));


// Require the gulp folder with all the tasks, don't change this
require('./config/gulp');

// Add all the gruntfile tasks to gulp, don't change this
require('gulp-grunt')(gulp);