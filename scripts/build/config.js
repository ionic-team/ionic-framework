module.exports = {
  dist: 'dist',
  src: {
    test: ['src/**/test/*.spec.js'],
    js: ['src/**/*.js', '!src/**/test/**/*'],
    e2e: ['src/**/test/*/**/*'],
    html: 'src/**/*.html',
    scss: 'src/components/**/*.scss',
  },
  protractorPort: 8876
};
