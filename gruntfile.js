/* jshint node: true */

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

    // Exec shell commands.
    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      // Limited to Maintainers so
      // txpush: {
      //  command: 'tx push -s' // push the resources
      // },
      txpull: {
        command: 'tx pull -a --minimum-perc=25' // pull the .po files
      }
    },

    // Clean up build directory
    clean: {
      main: ['build']
    },

    // Copy the theme into the build directory
    copy: {
      main: {
        src:  [
          '**/*',
          '!bower_components/**'
        ],
        expand: true,
        cwd: 'src/',
        dest: 'build/'
      }
    },

    // compress
    compress: {
      main: {
        options: {
          mode: 'zip',
          archive: '.tmp/release/<%= pkg.name %>.<%= pkg.version %>.zip'
        },
        src: ['**/*'],
        expand: true,
        cwd: 'build/',
        dest: ''
      }
    },

    // // readme.txt to markdown
    // wp_readme_to_markdown: {
    //   readme: {
    //     files: {
    //       'build/readme.txt': 'README.md'
    //     }
    //   }
    // },

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
  require('load-grunt-tasks')(grunt);
  // grunt.loadNpmTasks('grunt-contrib-copy');

  // Register tasks
  grunt.registerTask('build', ['clean', 'copy', 'compress']);

  // Makepot and push it on Transifex
  grunt.registerTask('tx-push', ['makepot', 'exec:txpush_s']);
  // Pull from Transifex and create .mo
  grunt.registerTask('tx-pull', ['exec:txpull', 'potomo']);
  grunt.registerTask('lang', ['addtextdomain', 'makepot', 'potomo']);

  grunt.registerTask('docs', ['phpdocumentor'/*, 'flatdoc'*/]);
  // @@todo docs should be ignored and deployed or committed to gh-pages \\


  grunt.registerTask('default', ['build']);
  // grunt.registerTask( 'test', ['phpunit', 'qunit'] );
  // grunt.registerTask('travis', ['lintPHP']);

  grunt.registerTask('release', [
    'clean',
    'copy',
    'lang',
    'compress',
    'docs'
  ]);

  // grunt.registerTask('t', ['testtask']);
};
