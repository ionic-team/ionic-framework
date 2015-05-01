module.exports = {
  dist: 'dist',
  distLib: 'dist/lib',
  src: {
    spec: ['ionic/**/test/*.spec.js'],
    js: ['ionic/**/*.js', '!src/**/test/**/*.js'],

    // Get all the non-js files and main.js
    e2e: ['ionic/components/*/test/*/**/*'],
    html: 'ionic/**/*.html',
    scss: 'ionic/**/*.scss',
  },

  scripts: [
    {
      from: 'node_modules/gulp-traceur/node_modules/traceur/bin/traceur.js',
      to: 'traceur.js',
    }, {
      from: 'node_modules/es6-module-loader/dist/es6-module-loader.src.js',
      to: 'es6-module-loader.src.js'
    }, {
      from: 'node_modules/systemjs/dist/system.src.js',
      to: 'system.src.js'
    }, {
      from: 'scripts/e2e/system-init.js',
      to: 'system-init.js'
    }, {
      from: 'node_modules/angular2/node_modules/zone.js/zone.js',
      to: 'zone.js'
    }, {
      from: 'node_modules/angular2/node_modules/zone.js/long-stack-trace-zone.js',
      to: 'long-stack-trace-zone.js'
    },
    'angular2.js',
    'angular2-di.js',
    'ionic2.js',
//    'https://cdn.firebase.com/js/client/2.2.4/firebase.js'
//    'https://cdn.firebase.com/js/client/2.2.4/firebase-debug.js'
  ],

  traceurOptions: {
    sourceMaps: true,
    annotations: true,
    types: true,
    memberVariables: true,
    modules: 'instantiate',
  },

  protractorPort: 8876
};
