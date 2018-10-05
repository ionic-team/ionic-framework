import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'Ionic',
  bundles: [
    { components: ['ion-action-sheet', 'ion-action-sheet-controller'] },
    { components: ['ion-alert', 'ion-alert-controller'] },
    { components: ['ion-anchor', 'ion-back-button'] },
    { components: ['ion-animation-controller'] },
    { components: ['ion-app', 'ion-buttons', 'ion-content', 'ion-footer', 'ion-header', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-backdrop'] },
    { components: ['ion-button', 'ion-icon'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title', 'ion-card-subtitle'] },
    { components: ['ion-checkbox'] },
    { components: ['ion-chip', 'ion-chip-button', 'ion-chip-icon'] },
    { components: ['ion-datetime', 'ion-picker', 'ion-picker-column', 'ion-picker-controller'] },
    { components: ['ion-fab', 'ion-fab-button', 'ion-fab-list'] },
    { components: ['ion-grid', 'ion-row', 'ion-col'] },
    { components: ['ion-hide-when', 'ion-show-when'] },
    { components: ['ion-infinite-scroll', 'ion-infinite-scroll-content'] },
    { components: ['ion-input'] },
    { components: ['ion-textarea'] },
    { components: ['ion-item', 'ion-item-divider', 'ion-item-group', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text', 'ion-note'] },
    { components: ['ion-item-sliding', 'ion-item-options', 'ion-item-option'] },
    { components: ['ion-loading', 'ion-loading-controller'] },
    { components: ['ion-menu', 'ion-menu-controller', 'ion-menu-toggle', 'ion-menu-button'] },
    { components: ['ion-modal', 'ion-modal-controller'] },
    { components: ['ion-nav', 'ion-nav-pop', 'ion-nav-push', 'ion-nav-set-root'] },
    { components: ['ion-img'] },
    { components: ['ion-popover', 'ion-popover-controller'] },
    { components: ['ion-radio', 'ion-radio-group'] },
    { components: ['ion-range'] },
    { components: ['ion-refresher', 'ion-refresher-content'] },
    { components: ['ion-reorder', 'ion-reorder-group'] },
    { components: ['ion-ripple-effect'] },
    { components: ['ion-router', 'ion-route', 'ion-route-redirect', 'ion-router-outlet'] },
    { components: ['ion-searchbar'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-select', 'ion-select-option', 'ion-select-popover'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-spinner'] },
    { components: ['ion-split-pane'] },
    { components: ['ion-tabs', 'ion-tab', 'ion-tabbar'] },
    { components: ['ion-text'] },
    { components: ['ion-toast', 'ion-toast-controller'] },
    { components: ['ion-toggle'] },
    { components: ['ion-virtual-scroll'] },
  ],
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'stats',
      file: 'stats.json'
    },
    {
      type: 'angular',
      componentCorePackage: '@ionic/core',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
      directivesArrayFile: '../angular/src/directives/proxies-list.txt',
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
  ],
  testing: {
    allowableMismatchedPixels: 200,
    pixelmatchThreshold: 0.1,
    emulate: [
      {
        userAgent: 'iPhone',
        width: 400,
        height: 800,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      },
      {
        userAgent: 'Android',
        width: 400,
        height: 800,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      }
    ]
  },
  copy: [{ src: '**/*.scss' }],
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  globalScript: 'src/global/ionic-global.ts',
  enableCache: true,
};
