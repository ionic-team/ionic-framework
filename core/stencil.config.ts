import { angularOutputTarget } from '@stencil/angular-output-target';
import type { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { vueOutputTarget } from '@stencil/vue-output-target';

// @ts-ignore
import { apiSpecGenerator } from './scripts/api-spec-generator';

export const config: Config = {
  autoprefixCss: true,
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
    { components: ['ion-menu', 'ion-menu-toggle', 'ion-menu-button'] },
    { components: ['ion-modal'] },
    { components: ['ion-nav', 'ion-nav-link'] },
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
    { components: ['ion-accordion-group', 'ion-accordion'] },
    { components: ['ion-breadcrumb', 'ion-breadcrumbs'] },
  ],
  plugins: [
    sass(),
  ],
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@ionic/core',
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../packages/react/src/components/proxies.ts',
      excludeComponents: [
        // Routing
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',
        'ion-back-button',
        'ion-breadcrumb',
        'ion-tab-button',
        'ion-tabs',
        'ion-tab-bar',
        'ion-button',
        'ion-card',
        'ion-fab-button',
        'ion-item',
        'ion-item-option',

        // Overlays
        'ion-action-sheet',
        'ion-alert',
        'ion-loading',
        'ion-modal',
        'ion-picker',
        'ion-popover',
        'ion-toast',

        'ion-app',
        'ion-icon'
      ]
    }),
    vueOutputTarget({
      componentCorePackage: '@ionic/core',
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      proxiesFile: '../packages/vue/src/proxies.ts',
      excludeComponents: [
        // Routing
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',
        'ion-back-button',
        'ion-tab-button',
        'ion-tabs',
        'ion-tab',
        'ion-tab-bar',

        // Overlays
        'ion-action-sheet',
        'ion-alert',
        'ion-loading',
        'ion-modal',
        'ion-picker',
        'ion-popover',
        'ion-toast',

        'ion-app',
        'ion-icon'
      ],
      componentModels: [
        {
          elements: ['ion-checkbox', 'ion-toggle'],
          targetAttr: 'checked',
          event: 'v-ion-change',
          externalEvent: 'ionChange'
        },
        {
          elements: ['ion-datetime', 'ion-input', 'ion-radio-group', 'ion-radio', 'ion-range', 'ion-searchbar', 'ion-segment', 'ion-segment-button', 'ion-select', 'ion-textarea', 'ion-accordion-group'],
          targetAttr: 'value',
          event: 'v-ion-change',
          externalEvent: 'ionChange'
        }
      ],
    }),
    {
      type: 'docs-vscode',
      file: 'dist/html.html-data.json',
      sourceCodeBaseUrl: 'https://github.com/ionic-team/ionic/tree/main/core/',
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements',
      dir: 'components',
      copy: [{
        src: '../scripts/custom-elements',
        dest: 'components',
        warn: true
      }],
      includeGlobalScripts: false
    },
    {
      type: 'docs-json',
      file: '../docs/core.json'
    },
    {
      type: 'dist-hydrate-script'
    },
    apiSpecGenerator({
      file: 'api.txt'
    }) as any,
    // {
    //   type: 'stats',
    //   file: 'stats.json'
    // },
    angularOutputTarget({
      componentCorePackage: '@ionic/core',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
      directivesArrayFile: '../angular/src/directives/proxies-list.ts',
      excludeComponents: [
        // overlays
        'ion-action-sheet',
        'ion-alert',
        'ion-loading',
        'ion-modal',
        'ion-picker',
        'ion-popover',
        'ion-toast',
        'ion-toast',

        // navigation
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',

        // tabs
        'ion-tabs',
        'ion-tab',

        // auxiliar
        'ion-picker-column',
        'ion-virtual-scroll'
      ],
    }),
  ],
  buildEs5: 'prod',
  extras: {
    dynamicImportShim: true,
    initializeNextTick: true,
    scriptDataOpts: true
  },
  testing: {
    moduleNameMapper: {
      "@utils/test": ["<rootDir>/src/utils/test/utils"],
      "@utils/logging": ["<rootDir>/src/utils/logging"],
    },
  },
  preamble: '(C) Ionic http://ionicframework.com - MIT License',
  globalScript: 'src/global/ionic-global.ts',
  enableCache: true,
};
