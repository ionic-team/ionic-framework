import { task, src, dest } from 'gulp';
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const multiEntry = require('rollup-plugin-multi-entry');
const uglify = require('rollup-plugin-uglify');

const nodeResolveOptions = {
  jsnext: true,
  main: true
};

const modernEntries = [
  'node_modules/core-js/es6/array.js',
  'node_modules/core-js/es6/date.js',
  'node_modules/core-js/es6/function.js',
  'node_modules/core-js/es6/map.js',
  'node_modules/core-js/es6/number.js',
  'node_modules/core-js/es6/object.js',
  'node_modules/core-js/es6/parse-float.js',
  'node_modules/core-js/es6/parse-int.js',
  'node_modules/core-js/es6/promise.js',
  'node_modules/core-js/es6/set.js',
  'node_modules/core-js/es6/string.js',
  'node_modules/core-js/es7/reflect.js',
  'node_modules/core-js/es6/reflect.js',
  'node_modules/zone.js/dist/zone.js',
];

const allEntries = [
  'node_modules/core-js/es6/index.js',
  'node_modules/core-js/es7/reflect.js',
  'node_modules/zone.js/dist/zone.js',
];

const ngEntries = [
  'node_modules/core-js/es7/reflect.js',
  'node_modules/zone.js/dist/zone.js',
];

task('polyfill', ['polyfill.modern', 'polyfill.all', 'polyfill.ng', 'polyfill.copy-readme']);

task('polyfill.all', () => {
  return rollup.rollup({
    entry: allEntries,
    plugins: [
      multiEntry(),
      nodeResolve(nodeResolveOptions),
      commonjs(),
      uglify()
    ]
  }).then((bundle) => {
    bundle.write({
      format: 'iife',
      moduleName: 'MyBundle',
      dest: 'dist/ionic-angular/polyfills/polyfills.js'
    });
  });
});

task('polyfill.ng', () => {
  return rollup.rollup({
    entry: ngEntries,
    plugins: [
      multiEntry(),
      nodeResolve(nodeResolveOptions),
      commonjs(),
      uglify()
    ]
  }).then((bundle) => {
    bundle.write({
      format: 'iife',
      moduleName: 'MyBundle',
      dest: 'dist/ionic-angular/polyfills/polyfills.ng.js'
    });
  });
});

task('polyfill.modern', (done) => {
  return rollup.rollup({
    entry: modernEntries,
    plugins: [
      multiEntry(),
      nodeResolve(nodeResolveOptions),
      commonjs(),
      uglify()
    ]
  }).then((bundle) => {
    bundle.write({
      format: 'iife',
      moduleName: 'MyBundle',
      dest: 'dist/ionic-angular/polyfills/polyfills.modern.js'
    });
  });
});

task('polyfill.copy-readme', (done) => {
  const rename = require('gulp-rename');

  return src('scripts/npm/polyfills.readme.md')
    .pipe(rename({
      basename: 'README'
    }))
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});
