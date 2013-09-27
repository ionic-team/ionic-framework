module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'js/ionic.js',
          'js/platform.js',
          'js/utils.js',
          'js/events.js',
          'js/gestures.js',
          'js/animate.js',
          'js/viewController.js',
          'js/views/navBar.js',
          'js/views/headerBar.js',
          'js/views/tabBar.js',
          'js/views/sideMenu.js',
          'js/views/toggleView.js',
          'js/controllers/**/*.js',
          'js/tapPolyfill.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      distAngular: {
        src: [
          'ext/angular/src/*.js'
        ],
        dest: 'dist/<%= pkg.name %>-angular.js'
      },
      distSimple: {
        src: [
          'ext/simple/*.js'
        ],
        dest: 'dist/<%= pkg.name %>-simple.js'
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
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/ionic.css': 'scss/ionic/ionic.scss',
          'dist/ionic-ios7.css': 'scss/ionic-ios7/ionic-ios7.scss'
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
