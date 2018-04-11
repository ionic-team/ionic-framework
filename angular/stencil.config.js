const path = require('path');

// use ionic/core's stencil config
exports.config = require('../core/stencil.config.js').config;

// user ionic core's tsconfig
exports.config.tsconfig ='../core/tsconfig.json';

// update where to find the original ionic/core src
exports.config.srcDir = '../core/src';
exports.config.globalScript = '../core/src/global/ionic-global.ts';

// update the output targets
exports.config.outputTargets = [
  {
    type: 'angular',
    directivesProxyFile: 'src/directives/proxies.ts',
    directivesArrayFile: 'src/directives/proxies-list.txt',
    empty: false,
    excludeComponents: [
      // overlays
      'ion-action-sheet',
      'ion-action-sheet-controller',
      'ion-alert',
      'ion-alert-controller',
      'ion-loading',
      'ion-loading-controller',
      'ion-modal',
      'ion-modal-controller',
      'ion-picker',
      'ion-picker-controller',
      'ion-popover',
      'ion-popover-controller',
      'ion-toast',
      'ion-toast-controller',
      'ion-toast',

      // controllers
      'ion-menu-controller',
      'ion-animation-controller',
      'ion-animation-controller',
      'ion-gesture-controller',
      'ion-platform',
      'ion-cordova-platform',

      // navigation
      'ion-router',
      'ion-route',
      'ion-route-redirect',
      'ion-router-outlet',
      'ion-anchor',
      'ion-tabbar',
      'ion-tab-button',

      // auxiliar
      'ion-gesture',
      'ion-status-tap',
      'ion-tap-click',
      'ion-picker-column',
      'ion-range-knob',
      'ion-input-shims',
      'ion-backdrop',
      'ion-anchor',
      'ion-virtual-scroll'
    ]
  }
]

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
