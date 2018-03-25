exports.config = {
  globalStyle: 'src/global/app.css',
  outputTargets: [
    {
      type: 'www',
      dir: '../../theme-builder',
      serviceWorker: true
    }
  ]
};

exports.devServer = {
  root: '../../',
  watchGlob: 'src/**',
  openUrl: '/theme-builder'
};
