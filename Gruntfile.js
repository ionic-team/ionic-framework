var cp = require('child_process');
var buildConfig = require('./config/build');

module.exports = function(grunt) {

  grunt.initConfig({

    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: buildConfig.ionicFiles,
        dest: 'dist/js/ionic.js'
      },
      distAngular: {
        src: buildConfig.angularIonicFiles,
        dest: 'dist/js/ionic-angular.js'
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: './config/lib/',
          src: buildConfig.vendorFiles,
          dest: './dist/'
        }]
      }
    },

    //Used by CI to check for temporary test code
    //xit, iit, ddescribe, xdescribe
    'ddescribe-iit': ['js/**/*.js'],
    'merge-conflict': ['js/**/*.js'],

    jshint: {
      files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      single: {
        options: {
          singleRun: true
        }
      },
      sauce: {
        options: {
          singleRun: true,
          configFile: 'config/karma-sauce.conf.js'
        }
      },
      watch: {
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/ionic.min.js': 'dist/js/ionic.js',
          'dist/js/ionic-angular.min.js': 'dist/js/ionic-angular.js'
        }
      },
      options: {
        preserveComments: 'some'
      }
    },

    sass: {
      dist: {
        files: {
          'dist/css/ionic.css': 'scss/ionic.scss',
        }
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/css/ionic.min.css': 'dist/css/ionic.css',
        }
      }
    },

    'string-replace': {
      version: {
        files: {
          'dist/js/ionic.js': 'dist/js/ionic.js',
          'dist/js/ionic.min.js': 'dist/js/ionic.min.js',
          'dist/js/ionic-angular.js': 'dist/js/ionic-angular.js',
          'dist/js/ionic-angular.min.js': 'dist/js/ionic-angular.min.js',
          'dist/css/ionic.css': 'dist/css/ionic.css',
          'dist/css/ionic.min.css': 'dist/css/ionic.min.css'
        },
        options: {
          replacements: [{
            pattern: /{{ VERSION }}/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    },

    bump: {
     options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        push: false
      }
    },

    watch: {
      scripts: {
        files: ['js/**/*.js', 'ext/**/*.js'],
        tasks: ['concat', 'string-replace'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass', 'concat', 'string-replace'],
        options: {
          spawn: false
        }
      }
    },

    pkg: grunt.file.readJSON('package.json')
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);

  grunt.registerTask('build', [
    'sass',
    'cssmin',
    'concat',
    'copy',
    'uglify',
    'string-replace'
  ]);

  grunt.registerMultiTask('karma', 'Run karma', function() {
    var done = this.async();
    var options = this.options();
    var config = options.configFile;
    var browsers = grunt.option('browsers');
    var singleRun = grunt.option('singleRun') || options.singleRun;
    var reporters = grunt.option('reporters');

    cp.spawn('node', ['node_modules/karma/bin/karma', 'start', config,
             browsers ? '--browsers=' + browsers : '',
             singleRun ? '--single-run=' + singleRun : '',
             reporters ? '--reporters=' + reporters : ''
    ], { stdio: 'inherit' })
    .on('exit', function(code) {
      if (code) return grunt.fail.warn('Karma test(s) failed. Exit code: ' + code);
      done();
    });
  });
};
