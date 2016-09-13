import { task, src, dest } from 'gulp';
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

task('polyfill', ['polyfill.modern', 'polyfill.all', 'polyfill.ng', 'polyfill.copy-readme']);

task('polyfill.modern', (done) => {
    return src([
        'node_modules/zone.js/dist/zone.min.js',
        'node_modules/zone.js/dist/proxy.min.js',
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
        'node_modules/core-js/es7/reflect.js'
    ])
    .pipe(concat('polyfills.modern.js'))
    .pipe(uglify())
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});

task('polyfill.all', (done) => {
    return src([
        'node_modules/zone.js/dist/zone.min.js',
        'node_modules/zone.js/dist/proxy.min.js',
        'node_modules/core-js/es6/index.js',
        'node_modules/core-js/es7/reflect.js'
    ])
    .pipe(concat('polyfills.js'))
    .pipe(uglify())
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});

task('polyfill.ng', (done) => {
    return src([
        'node_modules/zone.js/dist/zone.min.js',
        'node_modules/zone.js/dist/proxy.min.js',
        'node_modules/core-js/es7/reflect.js'
    ])
    .pipe(concat('polyfills.ng.js'))
    .pipe(uglify())
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});

task('polyfill.copy-readme', (done) => {
    return src('scripts/npm/polyfills.readme.md')
    .pipe(dest('dist/ionic-angular/polyfills/README.md'), done);
});
