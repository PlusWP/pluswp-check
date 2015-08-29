/* global gulp, $ */
/* jshint node: true */
'use strict';

// @@todo \\

// gulp.task('_build-clean', function () {
//   console.log('global.PATHS.build.root', global.PATHS.build.root);
//   return gulp.src(global.PATHS.build.root)
//     .pipe($.rimraf());
// });
var del = require('del');

gulp.task('_release-clean', function (cb) {
  del([ global.PATHS.build.root + '/**/*' ], cb);
});

gulp.task('_release-copy', function () {
  return gulp.src('**/*', { cwd: global.PATHS.src.root })
    .pipe(gulp.dest(global.PATHS.build.root));
});

gulp.task('release', [
  '_release-prepare' // task specific to each single project
]);

// @public
// gulp.task('release', ['build']);

// test
//   commands:
// build --dist
// ftp stuff

// release
//   commands:
// build --dist
// phpdoc
// git stuff
// wordpress svn stuff ?