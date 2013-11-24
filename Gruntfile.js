module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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
          'js/views/slideBoxView.js',
          'js/views/tabBarView.js',
          'js/views/toggleView.js',

          // Controllers
          'js/controllers/viewController.js',

          'js/controllers/navController.js',
          'js/controllers/sideMenuController.js',
          'js/controllers/tabBarController.js'

        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      },
      distAngular: {
        src: [
          'js/_license.js',
          'vendor/angular/1.2.1/angular.js',
          'vendor/angular/1.2.1/angular-animate.js',
          'vendor/angular/1.2.1/angular-resource.js',
          'vendor/angular/1.2.1/angular-sanitize.js',
          'vendor/angular/1.2.1/angular-touch.js',
          'vendor/angular/1.2.1/angular-route.js',
          'js/ext/angular/src/ionicAngular.js',
          'js/ext/angular/src/service/**/*.js',
          'js/ext/angular/src/directive/**/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>-angular.js'
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/ionic.css': 'scss/ionic.scss',
          'dist/css/themes/ionic-ios7.css': 'scss/themes/ios7/ionic-ios7.scss'
        }
      }
    },
    watch: {
      scripts: {
        files: ['js/**/*.js', 'ext/**/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: ['scss/**/*.scss'],
        tasks: ['sass', 'concat'],
        options: {
          spawn: false
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'sass', 'concat']);
};
