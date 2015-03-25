module.exports = {
  dist: 'dist',
  src: {
    test: ['src/**/test/*.spec.js'],
    js: ['src/**/*.js', '!src/**/test/**/*'],
    e2e: ['src/**/test/*/**/*'],
    html: 'src/**/*.html',
    scss: 'src/components/**/*.scss',
  },
  traceurOptions: {
    'sourceMaps': true,
    'annotations': true,
    'types': true,
    'script': false,
    'memberVariables': true,
    'modules': 'instantiate'
  },
  protractorPort: 8876
};
