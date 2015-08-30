/* global gulp */
/* jshint node: true */
'use strict';

var pkg = require('../../package.json');
var sequence = require('gulp-sequence');
var del = require('del');

// @access private, called by `gulp release`
gulp.task('_release-prepare', ['_release-lang'], sequence([
  '_release-create-index',
  '_release-lang-mo'
]));

// @access private
gulp.task('_release-lang', ['_release-folders'], sequence([
  '_release-replace-words',
  'grunt-lang'
]));

// @access private
gulp.task('_release-folders', sequence([
  // '_release-clean', // @@doubt \\
  '_release-copy',
]));

var pathMoFiles = [
  './build/languages/*.mo',
  '!./build/languages/' + pkg.config.textDomain + '-*.mo'
];

// @access private
gulp.task('_release-lang-mo_rename', function () {
  return gulp.src(pathMoFiles)
    .pipe($.rename({ prefix: pkg.config.textDomain + '-' }))
    .pipe(gulp.dest('./build/languages/'))
});

// @access private
gulp.task('_release-lang-mo', ['_release-lang-mo_rename'], function (cb) {
  del(pathMoFiles, cb);
});

// @access public
gulp.task('deploy', ['_deploy-build']);

// @access private
gulp.task('_deploy-build', function () {
  return gulp.src('./build/**/*')
    .pipe($.ghPages({
      branch: 'trunk'
    }));
});