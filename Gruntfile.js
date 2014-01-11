module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      options: {
        separator: ';\n'
      },
      dist: {
        src: [
          'js/_license.js',

          // Base
          'js/ionic.js',

          // Utils
          'js/utils/**/*.js',

          // Views
          'js/views/view.js',

          'js/views/scrollView.js',

          'js/views/actionSheetView.js',
          'js/views/checkboxView.js',
          'js/views/headerBarView.js',
          'js/views/listView.js',
          'js/views/ListViewScroll.js',
          'js/views/loadingView.js',
          'js/views/modalView.js',
          'js/views/navBarView.js',
          'js/views/popupView.js',
          'js/views/sideMenuView.js',
          'js/views/sliderView.js',
          'js/views/tabBarView.js',
          'js/views/toggleView.js',

          // Controllers
          'js/controllers/viewController.js',

          'js/controllers/navController.js',
          'js/controllers/sideMenuController.js',
          'js/controllers/tabBarController.js'

        ],
        dest: 'dist/js/ionic.js'
      },
      distAngular: {
        src: [
          'js/_license.js',
          'js/ext/angular/src/ionicAngular.js',
          'js/ext/angular/src/service/**/*.js',
          'js/ext/angular/src/directive/**/*.js'
        ],
        dest: 'dist/js/ionic-angular.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
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
    'sass',
    'cssmin',
    'concat',
    'uglify',
    'string-replace'
  ]);
};
