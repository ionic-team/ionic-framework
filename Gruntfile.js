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
      distangular: {
        src: buildConfig.angularIonicFiles,
        dest: 'dist/js/ionic-angular.js'
      },
      bundle: {
        options: {
          banner:
            '/*!\n' +
            ' * ionic.bundle.js is a concatenation of:\n' +
            ' * ionic.js, angular.js, angular-animate.js,\n'+
            ' * angular-ui-router.js, and ionic-angular.js\n'+
            ' */\n\n'
        },
        src: [
          'dist/js/ionic.js',
          'config/lib/js/angular/angular.js',
          'config/lib/js/angular/angular-animate.js',
          'config/lib/js/angular-ui/angular-ui-router.js',
          'dist/js/ionic-angular.js'
        ],
        dest: 'dist/js/ionic.bundle.js'
      },
      bundlemin: {
        options: {
          banner: '<%= concat.bundle.options.banner %>'
        },
        src: [
          'dist/js/ionic.min.js',
          'config/lib/js/angular/angular.min.js',
          'config/lib/js/angular/angular-animate.min.js',
          'config/lib/js/angular-ui/angular-ui-router.min.js',
          'dist/js/ionic-angular.min.js'
        ],
        dest: 'dist/js/ionic.bundle.min.js'
      }
    },

    version: {
      dist: {
        dest: 'dist/version.json'
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

    'removelogging': {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/js/',
          src: ['*.js'],
          dest: '.'
        }],
        options: {
          methods: 'log info assert count clear group groupEnd groupCollapsed trace debug dir dirxml profile profileEnd time timeEnd timeStamp table exception'.split(' ')
        }
      }
    },

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
          'dist/js/ionic-angular.js': 'dist/js/ionic-angular.js',
          'dist/css/ionic.css': 'dist/css/ionic.css',
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
        tasks: ['concat:dist', 'concat:distangular', 'concat:bundle'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass'],
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
    'concat:dist',
    'concat:distangular',
    'copy',
    'string-replace',
    'uglify',
    'version',
    'concat:bundle',
    'concat:bundlemin'
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

  grunt.registerMultiTask('version', 'Generate version JSON', function() {
    var pkg = grunt.config('pkg');
    this.files.forEach(function(file) {
      var dest = file.dest;
      var d = new Date();
      var version = {
        version: pkg.version,
        codename: pkg.codename,
        date: grunt.template.today('yyyy-mm-dd'),
        time: d.getUTCHours() + ':' + d.getUTCMinutes() + ':' + d.getUTCSeconds()
      };
      grunt.file.write(dest, JSON.stringify(version, null, 2));
    });
  });
};
