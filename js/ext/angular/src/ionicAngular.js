/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */

/**
 * @ngdoc module
 * @name ionic
 * @description
 * Ionic main module.
 */

angular.module('ionic.service', [
  'ionic.service.bind',
  'ionic.service.platform',
  'ionic.service.actionSheet',
  'ionic.service.gesture',
  'ionic.service.loading',
  'ionic.service.modal',
  'ionic.service.popup',
  'ionic.service.templateLoad',
  'ionic.service.view',
  'ionic.decorator.location'
]);

angular.module('ionic.ui', [
    'ionic.ui.checkbox',
    'ionic.ui.content',
    'ionic.ui.header',
    'ionic.ui.list',
    'ionic.ui.navBar',
    'ionic.ui.popup',
    'ionic.ui.radio',
    'ionic.ui.scroll',
    'ionic.ui.sideMenu',
    'ionic.ui.slideBox',
    'ionic.ui.tabs',
    'ionic.ui.toggle',
    'ionic.ui.touch',
    'ionic.ui.viewState'
]);

angular.module('ionic', [
    'ionic.service',
    'ionic.ui',

    // Angular deps
    'ngAnimate',
    'ngSanitize',
    'ui.router'
]);
