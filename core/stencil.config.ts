import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// @ts-ignore
import { apiSpecGenerator } from './scripts/api-spec-generator';

export const config: Config = {
  namespace: 'Ionic',
  bundles: [
    { components: ['ion-action-sheet'] },
    { components: ['ion-alert'] },
    { components: ['ion-back-button'] },
    { components: ['ion-app', 'ion-router-outlet', 'ion-buttons', 'ion-content', 'ion-footer', 'ion-header', 'ion-title', 'ion-toolbar'] },
    { components: ['ion-avatar', 'ion-badge', 'ion-thumbnail'] },
    { components: ['ion-backdrop'] },
    { components: ['ion-button', 'ion-icon'] },
    { components: ['ion-card', 'ion-card-content', 'ion-card-header', 'ion-card-title', 'ion-card-subtitle'] },
    { components: ['ion-checkbox'] },
    { components: ['ion-chip'] },
    { components: ['ion-datetime', 'ion-picker', 'ion-picker-column'] },
    { components: ['ion-fab', 'ion-fab-button', 'ion-fab-list'] },
    { components: ['ion-grid', 'ion-row', 'ion-col'] },
    { components: ['ion-infinite-scroll', 'ion-infinite-scroll-content'] },
    { components: ['ion-input'] },
    { components: ['ion-textarea'] },
    { components: ['ion-item', 'ion-item-divider', 'ion-item-group', 'ion-label', 'ion-list', 'ion-list-header', 'ion-skeleton-text', 'ion-note'] },
    { components: ['ion-item-sliding', 'ion-item-options', 'ion-item-option'] },
    { components: ['ion-loading'] },
    { components: ['ion-menu', 'ion-menu-controller', 'ion-menu-toggle', 'ion-menu-button'] },
    { components: ['ion-modal'] },
    { components: ['ion-nav', 'ion-nav-pop', 'ion-nav-push', 'ion-nav-set-root'] },
    { components: ['ion-img'] },
    { components: ['ion-popover'] },
    { components: ['ion-progress-bar'] },
    { components: ['ion-radio', 'ion-radio-group'] },
    { components: ['ion-range'] },
    { components: ['ion-refresher', 'ion-refresher-content'] },
    { components: ['ion-reorder', 'ion-reorder-group'] },
    { components: ['ion-ripple-effect'] },
    { components: ['ion-router', 'ion-route', 'ion-route-redirect', 'ion-router-link'] },
    { components: ['ion-searchbar'] },
    { components: ['ion-segment', 'ion-segment-button'] },
    { components: ['ion-select', 'ion-select-option', 'ion-select-popover'] },
    { components: ['ion-slides', 'ion-slide'] },
    { components: ['ion-spinner'] },
    { components: ['ion-split-pane'] },
    { components: ['ion-tabs', 'ion-tab'] },
    { components: ['ion-tab-bar', 'ion-tab-button'] },
    { components: ['ion-text'] },
    { components: ['ion-toast'] },
    { components: ['ion-toggle'] },
    { components: ['ion-virtual-scroll'] },

    // Deprecated
    { components: [
      'ion-anchor',
      'ion-action-sheet-controller',
      'ion-alert-controller',
      'ion-loading-controller',
      'ion-modal-controller',
      'ion-popover-controller',
      'ion-picker-controller',
      'ion-toast-controller',
    ]},
  ],
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: '**/*.scss' }
      ]
    },
    // {
    //   type: 'experimental-dist-module',
    //   externalRuntime: true,
    // },
    {
      type: 'docs-readme',
      strict: true
    },
    {
      type: 'docs-json',
      file: '../docs/core.json'
    },
    apiSpecGenerator({
      file: 'api.txt'
    }),
    // {
    //   type: 'stats',
    //   file: 'stats.json'
    // },
    {
      type: 'angular',
      componentCorePackage: '@ionic/core',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
      directivesUtilsFile: '../angular/src/directives/proxies-utils.ts',
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

        // navigation
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',
        'ion-anchor',

        // tabs
        'ion-tabs',
        'ion-tab',

        // auxiliar
        'ion-picker-column',
        'ion-virtual-scroll'
      ]
    }
  ],
  testing: {
    allowableMismatchedPixels: 200,
    pixelmatchThreshold: 0.05,
    waitBeforeScreenshot: 20,
    emulate: [
      {
        userAgent: 'iPhone',
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false
        }
      },
      {
        userAgent: 'Android',
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false
        }
      }
    ]
  },
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  globalScript: 'src/global/ionic-global.ts',
  enableCache: true,
};
