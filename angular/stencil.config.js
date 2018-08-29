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
    componentCorePackage: '@ionic/core',
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

      // navigation
      'ion-router',
      'ion-route',
      'ion-route-redirect',
      'ion-router-outlet',
      'ion-anchor',
      'ion-tabbar',

      // auxiliar
      'ion-picker-column',
      'ion-anchor',
      'ion-virtual-scroll'
    ]
  }
]

exports.devServer = {
  root: '.',
  watchGlob: ['dist/*.*', 'dist/ionic/**/**', 'src/**/*.html']
};
