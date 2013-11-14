module.exports = function(grunt) {

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
          'js/views/slideBox.js',
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
          'vendor/angular/1.2.0/angular.min.js',
          'vendor/angular/1.2.0/angular-animate.min.js',
          'vendor/angular/1.2.0/angular-resource.min.js',
          'vendor/angular/1.2.0/angular-sanitize.min.js',
          'vendor/angular/1.2.0/angular-touch.min.js',
          'js/ext/angular/src/ionicAngular.js',
          'js/ext/angular/src/service/**/*.js',
          'js/ext/angular/src/directive/**/*.js'
        ],
        dest: 'dist/js/<%= pkg.name %>-angular.js'
      }
    },
    copy: {
      ionicons: {
        files: [
          { expand: true, src: ['ionicons/fonts/*'], dest: 'dist/fonts/', flatten: true}
        ]
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'js/**/*.js', 'test/**/*.js'],
      options: {
        // Disable short circuit check, I will not bend to its will.
        expr: true,
        browser: true,
        multistr: true,
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          ionic: true,
          angular: true,
          console: true,
          module: true,
          document: true
        }
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

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['jshint', 'sass', 'concat']);
};
