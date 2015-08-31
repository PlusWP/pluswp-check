/* global gulp, $ */
/* jshint node: true */
'use strict';

var pkg = require('../../package.json');
var fs = require('fs');
var semver = require('semver');
var exec = require('child_process').exec;
var changelog = require('conventional-changelog');

var paths = gulp.paths;
var tagTypes = {
  patch: 'patch',
  feature: 'minor',
  release: 'major'
};
var version;

// @access public

gulp.task('deploy:init', function(done) {
  var tagType = tagTypes[$.util.env.tag];
  version = semver.inc(pkg.version, tagType);

  if (!$.util.env.tag) return done('--tag is required');
  if (!tagType) return done('--tag must be patch, feature or release');
  if ($.util.env.f) return $.git.exec({args: 'stash'});

  exec('git status -s', function(err, stdout, stderr) {
    if (err) return done(err);
    if (stdout.length) return done('Repositoty have not a clean status');
    done();
  });
});


gulp.task('changelog', ['deploy:init'], function (done) {
  changelog({
    repository: pkg.repository.url.replace('git://', 'https://')
                                  .replace('.git', ''),
    version: version,
    file: 'CHANGELOG.md'
  }, function(err, log) {
    fs.writeFileSync(__dirname + '/../CHANGELOG.md', log);
    done();
  });
});


gulp.task('bump', ['changelog'], function(done) {
  return gulp.src(['./package.json', './bower.json'])
    .pipe($.bump({version: version}))
    .pipe(gulp.dest('./'))
    .pipe($.size({ title: '/', showFiles: true }));
});


gulp.task('deploy:commit', ['bump'], function() {
  return gulp.src(['./package.json', './bower.json', './CHANGELOG.md'])
    .pipe($.git.add())
    .pipe($.git.commit('release: version ' + version))
    .pipe($.size({ title: '/', showFiles: true }));
});


gulp.task('deploy:tag', ['deploy:commit'], function(done) {
  $.git.tag('v'+version, 'release: version ' + version, done);
});


gulp.task('deploy:push', ['deploy:tag'], function(done) {
  $.git.push('origin', 'master', {args: '--tags'}, done);
});

gulp.task('deploy', [
  'deploy:init', 'changelog', 'bump',
  'deploy:commit', 'deploy:tag', 'deploy:push'
]);

