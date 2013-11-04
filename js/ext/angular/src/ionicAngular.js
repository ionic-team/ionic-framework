/**
 * Create a wrapping module to ease having to include too many
 * modules.
 */

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
    'ionic.ui'
])
