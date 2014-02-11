/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */
angular.module('ionic.service', [
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

// UI specific services and delegates
angular.module('ionic.ui.service', [
  'ionic.ui.service.scrollDelegate',
  'ionic.ui.service.slideBoxDelegate',
  'ionic.ui.service.sideMenuDelegate',
]);

angular.module('ionic.ui', [
                            'ionic.ui.bindHtml',
                            'ionic.ui.content',
                            'ionic.ui.scroll',
                            'ionic.ui.tabs',
                            'ionic.ui.viewState',
                            'ionic.ui.header',
                            'ionic.ui.sideMenu',
                            'ionic.ui.slideBox',
                            'ionic.ui.list',
                            'ionic.ui.checkbox',
                            'ionic.ui.toggle',
                            'ionic.ui.radio',
                            'ionic.ui.touch'
                           ]);


angular.module('ionic', [
    'ionic.service',
    'ionic.ui.service',
    'ionic.ui',

    // Angular deps
    'ngAnimate',
    'ui.router'
]);
