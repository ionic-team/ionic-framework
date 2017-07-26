exports.config = {
  namespace: 'Ionic',
  buildDir: 'dist',
  publicPath: '/dist',
  generateCollection: true,
  bundles: [
    { components: ['ion-app', 'ion-content', 'ion-fixed', 'ion-footer', 'ion-header', 'ion-navbar', 'ion-page', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-button', 'ion-buttons', 'ion-icon'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title'] },
    { components: ['ion-chip', 'ion-chip-button'] },
    { components: ['ion-fab', 'ion-fab-button', 'ion-fab-list'] },
    { components: ['ion-gesture', 'ion-scroll'], priority: 'low' },
    { components: ['ion-grid', 'ion-row', 'ion-col'] },
    { components: ['ion-item', 'ion-item-divider', 'ion-item-sliding', 'ion-item-options', 'ion-item-option', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text'] },
    { components: ['ion-loading', 'ion-loading-controller'] },
    { components: ['ion-menu'], priority: 'low' },
    { components: ['ion-modal', 'ion-modal-controller'] },
    { components: ['ion-searchbar'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-spinner'] },
    { components: ['ion-tabs', 'ion-tab', 'ion-tab-bar', 'ion-tab-button', 'ion-tab-highlight'] },
    { components: ['ion-toggle'] }
  ],
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  global: 'src/global/ionic-global.ts'
};

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
