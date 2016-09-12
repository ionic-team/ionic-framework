import { task, src, dest } from 'gulp';
const concat = require('gulp-concat');

task('polyfills', (done) => {
    return src([
        'node_modules/zone.js/zone.min.js',
        'node_modules/zone.js/proxy.min.js',
        'node_modules/core-js/es6/index.js',
        'node_modules/core-js/es7/reflect.js'
    ], {base: 'node_modules/'})
    .pipe(concat('polyfills.js'))
    .pipe(dest('dist/ionic-angular/polyfills/'), done);
});