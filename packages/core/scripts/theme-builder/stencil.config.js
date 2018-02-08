exports.config = {
  globalStyle: 'src/global/app.css',
  wwwDir: '../../theme-builder',
  serviceWorker: false
};

exports.devServer = {
  root: '../../',
  watchGlob: 'src/**',
  openUrl: '/theme-builder'
};
