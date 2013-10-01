module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [

          // Base
          'js/ionic.js',

          // Utils
          'js/utils/**/*.js',

          // Views
          'js/views/navBarView.js',
          'js/views/headerBarView.js',
          'js/views/sideMenuView.js',
          'js/views/tabBarView.js',
          'js/views/toggleView.js',

          // Controllers
          'js/controllers/**/*.js'

        ],
        dest: 'dist/<%= pkg.name %>.js'
      },
      distAngular: {
        src: [
          'js/ext/angular/src/*.js'
        ],
        dest: 'dist/<%= pkg.name %>-angular.js'
      },
      distSimple: {
        src: [
          'js/ext/simple/*.js'
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
