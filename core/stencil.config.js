const sass = require('@stencil/sass');
const postcss = require('@stencil/postcss');
const autoprefixer = require('autoprefixer');

exports.config = {
  namespace: 'Ionic',
  bundles: [
    { components: ['ion-app', 'ion-content', 'ion-scroll', 'ion-footer', 'ion-header', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-action-sheet', 'ion-action-sheet-controller'] },
    { components: ['ion-alert', 'ion-alert-controller'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title', 'ion-card-subtitle'] },
    { components: ['ion-chip', 'ion-chip-button'] },
    { components: ['ion-datetime', 'ion-picker', 'ion-picker-column', 'ion-picker-controller'] },
    { components: ['ion-fab', 'ion-fab-button', 'ion-fab-list'] },
    { components: ['ion-gesture', 'ion-gesture-controller'] },
    { components: ['ion-grid', 'ion-row', 'ion-col'] },
    { components: ['ion-item', 'ion-item-divider', 'ion-item-group', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text'] },
    { components: ['ion-item-sliding', 'ion-item-options', 'ion-item-option'] },
    { components: ['ion-infinite-scroll', 'ion-infinite-scroll-content'] },
    { components: ['ion-loading', 'ion-loading-controller'] },
    { components: ['ion-menu', 'ion-menu-controller', 'ion-menu-toggle', 'ion-menu-button'] },
    { components: ['ion-modal', 'ion-modal-controller'] },
    { components: ['ion-popover', 'ion-popover-controller'] },
    { components: ['ion-radio', 'ion-radio-group'] },
    { components: ['ion-reorder', 'ion-reorder-group'] },
    { components: ['ion-router', 'ion-route', 'ion-route-redirect'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-select', 'ion-select-option', 'ion-select-popover'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-range', 'ion-range-knob']},
    { components: ['ion-refresher', 'ion-refresher-content']},
    { components: ['ion-tabs', 'ion-tab', 'ion-tabbar', 'ion-tab-button'] },
    { components: ['ion-toast', 'ion-toast-controller'] },
    { components: ['ion-tap-click', 'ion-status-tap'] },
    { components: ['ion-platform', 'ion-cordova-platform'] },
    { components: ['ion-hide-when', 'ion-show-when'] },
  ],
  plugins: [
    sass(),
    postcss({
      plugins: [
        autoprefixer({
          browsers: [
            'last 2 versions',
            'iOS >= 8',
            'Android >= 4.4',
            'Explorer >= 11',
            'ExplorerMobile >= 11'
          ],
          cascade: false
        })
      ]
    })
  ],
  outputTargets: [
    {
      type: 'dist'
    }
  ],
  copy: [{ src: '**/*.scss' }],
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  globalScript: 'src/global/ionic-global.ts',
  buildStats: true,
  enableCache: false
};

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
