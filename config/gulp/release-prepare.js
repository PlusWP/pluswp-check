/* global gulp */
/* jshint node: true */
'use strict';

var sequence = require('gulp-sequence');


// @access private
gulp.task('_release-prepare-folder', sequence([
  // '_release-clean', // @@doubt \\
  '_release-copy',
  '_release-replace-words'
]));

// @access public
gulp.task('_release-prepare', ['_release-prepare-folder'], sequence([
  '_release-create-index',
  'grunt-lang'
]));
