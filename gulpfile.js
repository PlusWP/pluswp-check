/* jshint node: true */
'use strict';

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

// Require the gulp folder with all the tasks, don't change this
require('./config/gulp');

// Add all the gruntfile tasks to gulp, don't change this
require('gulp-grunt')(require('gulp'));
