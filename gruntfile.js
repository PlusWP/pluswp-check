/* jshint node: true */

/**
 * Gruntfile to automate language translations
 * thanks to {@link http://wp-translations.org/grunt-transifex-wordpress/}
 */
module.exports = function (grunt) {
  'use strict';

  // Project configuration
  grunt.initConfig({

    // Read all projects info from package.json
    pkg: grunt.file.readJSON('package.json'),

    // Add textdomain.
    addtextdomain: {
      options: {
        textdomain: 'kkch',
        updateDomains: ['kkch']
      },
      target: {
        files: {
          src: ['build/**/*.php', '!**/vendor*/**/*']
        }
      }
    },

    // Generate POT files.
    makepot: {
      target: {
        options: {
          type: 'wp-plugin',
          domainPath: 'languages',
          potFilename: 'kkch.pot',
          mainFile: 'knitkode-check.php',
          cwd: 'build/',
          // include: [''], // no glob
          // exclude: [''], // no glob
          potHeaders: {
            poedit: true,
            'report-msgid-bugs-to': 'https://github.com/knitkode/knitkode-check/issues',
            'language-team': 'LANGUAGE <dev@knitkode.com>',
            'x-poedit-keywordslist': true
          },
          updateTimestamp: true,
          // from http://git.io/vZ05R
          processPot: function (pot, options) {
            // pot.headers['report-msgid-bugs-to'] = 'https://github.com/knitkode/knitkode-check/issues';
            // pot.headers['last-translator'] = 'WP-Translations (http://wp-translations.org/)';
            // pot.headers['language-team'] = 'WP-Translations <wpt@wp-translations.org>';
            // pot.headers['language'] = 'en_US';
            var excluded_meta = [
              'Plugin Name of the plugin/theme',
              'Plugin URI of the plugin/theme',
              'Author of the plugin/theme',
              'Author URI of the plugin/theme'
            ];
            for (var translation in pot.translations['']) {
              if ('undefined' !== typeof pot.translations[''][translation].comments.extracted) {
                if (excluded_meta.indexOf( pot.translations[''][translation].comments.extracted) >= 0) {
                  console.log( 'Excluded meta: ' + pot.translations[''][translation].comments.extracted );
                  delete pot.translations[''][translation];
                }
              }
            }
            return pot;
          }
        }
      }
    },

    // Generate MO files.
    potomo: {
      dist: {
        // options: {
        //   poDel: true
        // },
        files: [{
          src: ['*.pot'],
          expand: true,
          cwd: 'build/languages/',
          dest: 'build/languages/',
          ext: '.mo',
          nonull: true
        }]
      }
    },

    // Exec shell commands.
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      trialList: {
       command: 'ls'
      }
    },

    // @@todo \\
    phpdocumentor: {
      options: {
        template: 'responsive-twig',
        directory: 'build',
        target: 'docs'
      },
      generate: {}
    },

    // flatdoc
    flatdoc: {
      dist: {
        options: {
          folder: 'docs/flatdoc'
        }
      },
    },

    // // php tests
    // phpunit: {
    //   classes: {
    //     dir: 'tests/phpunit/'
    //   },
    //   options: {
    //     bin: 'vendor/bin/phpunit',
    //     bootstrap: 'bootstrap.php.dist',
    //     colors: true,
    //     testSuffix: 'Tests.php'
    //   }
    // },
    // qunit: {
    //   all: ['tests/qunit/**/*.html']
    // }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-wp-i18n');
  grunt.loadNpmTasks('grunt-potomo');
  // grunt.loadNpmTasks('grunt-shell');
  // grunt.loadNpmTasks('grunt-phpdocumentor');
  // grunt.loadNpmTasks('grunt-flatdoc');

  // Register tasks
  grunt.registerTask('lang', [
    'addtextdomain',
    'makepot',
    // create .mo files
    'potomo'
  ]);
  // grunt.registerTask('docs', ['phpdocumentor'/*, 'flatdoc'*/]);
  // grunt.registerTask('test', ['phpunit', 'qunit'] );
  // grunt.registerTask('travis', ['lintPHP']);
};
