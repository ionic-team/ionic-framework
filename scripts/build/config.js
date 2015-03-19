module.exports = {
  dist: 'dist',
  src: {
    js: ['src/**/*.js', '!src/**/examples/**'],
    test: ['src/**/*.spec.js'],
    examples: ['src/**/examples/**'],
    html: 'src/**/*.html',
    scss: 'src/components/**/*.scss',
    playgroundJs: 'playground/**/*.js',
    playgroundFiles: ['playground/**/*', '!playground/**/*.js'],
  },
  lib: [
    'node_modules/gulp-traceur/node_modules/traceur/bin/traceur-runtime.js',
    'node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.src.js',
    'node_modules/systemjs/lib/extension-register.js',
    'node_modules/angular2/node_modules/zone.js/zone.js',
    'node_modules/hammerjs/hammer.js'
  ]
};
