/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */
angular.module('ionic.service', [
  'ionic.service.actionSheet',
  'ionic.service.gesture',
  'ionic.service.loading',
  'ionic.service.modal',
  'ionic.service.popup',
  'ionic.service.templateLoad'
]);

angular.module('ionic.ui', [
                            'ionic.ui.content',
                            'ionic.ui.tabs',
                            'ionic.ui.nav',
                            'ionic.ui.sideMenu',
                            'ionic.ui.list',
                            'ionic.ui.checkbox',
                            'ionic.ui.toggle',
                           ]);

angular.module('ionic', [
    'ionic.platform',
    'ionic.service',
    'ionic.ui',
]);
