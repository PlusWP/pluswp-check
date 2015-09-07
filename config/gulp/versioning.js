/* global gulp, $, CONFIG */
/* jshint node: true */
'use strict';

// var pkg = require('../../package.json');
// var fs = require('fs');
// var semver = require('semver');
// var exec = require('child_process').exec;
// var changelog = require('conventional-changelog');

/**
 * Versioning tasks
 *
 * From: https://github.com/ikari-pl/gulp-tag-version
 *
 * gulp patch     # makes v0.1.0 → v0.1.1
 * gulp feature   # makes v0.1.1 → v0.2.0
 * gulp release   # makes v0.2.1 → v1.0.0
 *
 * @access public
 */
gulp.task('versioning', function () {
  var importance;
  if (CONFIG.argv.patch) { importance = 'patch'; }
  if (CONFIG.argv.minor) { importance = 'minor'; }
  if (CONFIG.argv.major) { importance = 'major'; }
  return gulp.src('./package.json')
    .pipe($.bump({ type: importance }))
    .pipe(gulp.dest('./'));
    // commit the changed version number
    // .pipe($.git.commit('bumps package version'))
    // tag it in the repository
    // .pipe($.tagVersion());
});