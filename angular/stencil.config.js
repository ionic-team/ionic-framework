const path = require('path');

// use ionic/core's stencil config
exports.config = require('../core/stencil.config.js').config;

// update where to find the original ionic/core src
exports.config.srcDir = '../core/src';
exports.config.globalScript = '../core/src/global/ionic-global.ts';

// update the output targets
exports.config.outputTargets = [
  {
    type: 'angular',
    directivesProxyFile: 'src/directives/proxies.ts',
    empty: false,
    excludeComponents: [
      'ion-action-sheet',
      'ion-action-sheet-controller',
      'ion-alert',
      'ion-alert-controller',
      'ion-animation-controller',
      'ion-input-shims',
      'ion-loading',
      'ion-loading-controller',
      'ion-platform',
      'ion-menu-controller',
      'ion-modal',
      'ion-modal-controller',
      'ion-nav',
      'ion-picker',
      'ion-picker-column',
      'ion-picker-controller',
      'ion-popover',
      'ion-popover-controller',
      'ion-tab',
      'ion-tabs',
      'ion-toast',
      'ion-toast-controller',
      'ion-toast',
      'ion-virtual-scroll'
    ]
  }
]

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
