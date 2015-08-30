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
        textdomain: '<%= pkg.config.textDomain %>',
        updateDomains: ['pkgTextDomain']
      },
      target: {
        files: {
          src: ['build/**/*.php', '!vendor/**/*']
        }
      }
    },

    // Generate POT files.
    makepot: {
      target: {
        options: {
          type: 'wp-plugin',
          domainPath: 'languages',
          potFilename: '<%= pkg.config.textDomain %>.pot',
          mainFile: '<%= pkg.name %>.php',
          cwd: 'build/',
          // include: [''], // no glob
          // exclude: [''], // no glob
          potHeaders: {
            poedit: true,
            'report-msgid-bugs-to': '<%= pkg.repository.url %>/issues',
            'language-team': 'LANGUAGE <<%= pkg.author.email %>>'
          }
        }
      }
    },

    // Generate MO files.
    potomo: {
      dist: {
        options: {
          poDel: true
        },
        files: [{
          src: ['*.po'],
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
      txpush: {
       command: 'tx push -s'
      },
      txpull: {
        command: 'tx pull -a --minimum-perc=5'
      }
    },

    // @@todo here we miss only to automatically rename all the po/mo
    // files with the textdomain prefix \\

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
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-phpdocumentor');
  // grunt.loadNpmTasks('grunt-flatdoc');

  // Register tasks
  grunt.registerTask('lang', [
    'addtextdomain',
    // makepot
    'makepot',
    // push pot on Transifex
    'shell:txpush',
    // pull from Transifex
    'shell:txpull',
    // create .mo files
    'potomo'
  ]);
  // grunt.registerTask('docs', ['phpdocumentor'/*, 'flatdoc'*/]);
  // grunt.registerTask('test', ['phpunit', 'qunit'] );
  // grunt.registerTask('travis', ['lintPHP']);
  // @@todo docs should be ignored and deployed or committed to gh-pages \\
  grunt.registerTask('default', ['rename']);
};