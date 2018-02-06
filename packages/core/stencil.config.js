exports.config = {
  enableCache: false,
  namespace: 'Ionic',
  generateDistribution: true,
  generateWWW: false,
  bundles: [
    { components: ['ion-animation-controller'] },
    { components: ['ion-app', 'ion-content', 'ion-scroll', 'ion-footer', 'ion-header', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-action-sheet', 'ion-action-sheet-controller'] },
    { components: ['ion-alert', 'ion-alert-controller'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-backdrop'] },
    { components: ['ion-button', 'ion-buttons', 'ion-icon'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title'] },
    { components: ['ion-checkbox'] },
    { components: ['ion-chip', 'ion-chip-button'] },
    { components: ['ion-datetime', 'ion-picker', 'ion-picker-column', 'ion-picker-controller'] },
    { components: ['ion-events'] },
    { components: ['ion-fab', 'ion-fab-button', 'ion-fab-list'] },
    { components: ['ion-gesture'] },
    { components: ['ion-grid', 'ion-row', 'ion-col'] },
    { components: ['ion-item', 'ion-item-divider', 'ion-item-group', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text'] },
    { components: ['ion-item-sliding', 'ion-item-options', 'ion-item-option'] },
    { components: ['ion-infinite-scroll', 'ion-infinite-scroll-content'] },
    { components: ['ion-input', 'ion-textarea'] },
    { components: ['ion-loading', 'ion-loading-controller'] },
    { components: ['ion-menu', 'ion-menu-controller'] },
    { components: ['ion-modal', 'ion-modal-controller'] },
    { components: ['ion-nav', 'ion-page', 'ion-back-button'] },
    { components: ['ion-popover', 'ion-popover-controller'] },
    { components: ['ion-radio', 'ion-radio-group'] },
    { components: ['ion-reorder', 'ion-reorder-group'] },
    { components: ['ion-route', 'ion-router-controller'] },
    { components: ['ion-searchbar'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-select', 'ion-select-option', 'ion-select-popover'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-spinner'] },
    { components: ['ion-split-pane'] },
    { components: ['ion-range', 'ion-range-knob']},
    { components: ['ion-refresher', 'ion-refresher-content']},
    { components: ['ion-tabs', 'ion-tab', 'ion-tabbar', 'ion-tab-button'] },
    { components: ['ion-toggle'] },
    { components: ['ion-toast', 'ion-toast-controller'] },
    { components: ['ion-tap-click', 'ion-status-tap'] },
    { components: ['ion-cordova-platform'] },
  ],
  collections: [
    'ionicons'
  ],
  copy: [
    { src: '**/*.scss' }
  ],
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  globalScript: 'src/global/ionic-global.ts',
  enableCache: false,
  buildStats: true
};

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
