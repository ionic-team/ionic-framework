module.exports = {
  dist: 'dist',
  distLib: 'dist/lib',
  src: {
    spec: ['src/**/test/*.spec.js'],
    js: ['src/**/*.js', '!src/**/test/**/*.js'],
    e2e: ['src/components/*/test/*/**/*'],
    html: 'src/**/*.html',
    scss: 'src/components/**/*.scss',
  },

  dependencies: [
    'node_modules/traceur/bin/traceur.js',
    'node_modules/es6-module-loader/dist/es6-module-loader.js',
    'node_modules/es6-module-loader/dist/es6-module-loader.js.map',
    'node_modules/systemjs/dist/system.js',
    'node_modules/systemjs/dist/system.js.map',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/zone.js/zone.js',
    'node_modules/zone.js/long-stack-trace-zone.js',
    'node_modules/hammerjs/hammer.js',
    'node_modules/rx/dist/rx.all.js',
  ],
  scripts: [
    'traceur.js',
    'es6-module-loader.js',
    'system.js',
    'zone.js',
    'long-stack-trace-zone.js',
    'hammer.js',
    'angular2.js',
  ],

  traceurOptions: {
    'sourceMaps': true,
    'annotations': true,
    'types': true,
    'script': false,
    'memberVariables': true,
    'modules': 'instantiate'
  },
  protractorPort: 8876
}
