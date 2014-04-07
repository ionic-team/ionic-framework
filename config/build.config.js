module.exports = {
  dist: 'dist',
  distJs: 'dist/js',
  distCss: 'dist/css',

  banner:
    '/*!\n' +
    ' * Copyright 2014 Drifty Co.\n' +
    ' * http://drifty.com/\n' +
    ' *\n' +
    ' * Ionic, v<%= pkg.version %>\n' +
    ' * A powerful HTML5 mobile app framework.\n' +
    ' * http://ionicframework.com/\n' +
    ' *\n' +
    ' * By @maxlynch, @benjsperry, @adamdbradley <3\n' +
    ' *\n' +
    ' * Licensed under the MIT license. Please see LICENSE for more information.\n'+
    ' *\n' +
    ' */\n\n',
  bundleBanner:
    '/*!\n' +
    ' * ionic.bundle.js is a concatenation of:\n' +
    ' * ionic.js, angular.js, angular-animate.js,\n'+
    ' * angular-sanitize.js, angular-ui-router.js,\n'+
    ' * and ionic-angular.js\n'+
    ' */\n\n',
  closureStart: '(function() {\n',
  closureEnd: '\n})();',

  ionicFiles: [
    // Base
    'js/ionic.js',

    // Utils
    'js/utils/animate.js',
    'js/utils/dom.js',
    'js/utils/events.js',
    'js/utils/gestures.js',
    'js/utils/platform.js',
    'js/utils/poly.js',
    'js/utils/tap.js',
    'js/utils/activator.js',
    'js/utils/utils.js',
    'js/utils/keyboard.js',

    // Views
    'js/views/view.js',

    'js/views/scrollView.js',

    'js/views/actionSheetView.js',
    'js/views/headerBarView.js',
    'js/views/listView.js',
    'js/views/loadingView.js',
    'js/views/modalView.js',
    'js/views/navBarView.js',
    'js/views/sideMenuView.js',
    'js/views/sliderView.js',
    'js/views/tabBarView.js',
    'js/views/toggleView.js',

    // Controllers
    'js/controllers/viewController.js',

    'js/controllers/navController.js',
    'js/controllers/sideMenuController.js',
    'js/controllers/tabBarController.js'

  ],

  angularIonicFiles: [
    'js/ext/angular/src/*.js',
    'js/ext/angular/src/service/**/*.js',
    'js/ext/angular/src/directive/**/*.js',
    'js/ext/angular/src/controller/**/*.js'
  ],

  //Which vendor files to include in dist, used by build
  //Matched relative to config/lib/
  vendorFiles: [
    'js/angular/angular-animate.js',
    'js/angular/angular-animate.min.js',
    'js/angular/angular-resource.js',
    'js/angular/angular-resource.min.js',
    'js/angular/angular-sanitize.js',
    'js/angular/angular-sanitize.min.js',
    'js/angular/angular.js',
    'js/angular/angular.min.js',
    'js/angular-ui/angular-ui-router.js',
    'js/angular-ui/angular-ui-router.min.js',
    'fonts/ionicons.eot',
    'fonts/ionicons.svg',
    'fonts/ionicons.ttf',
    'fonts/ionicons.woff'
  ],

  ionicBundleFiles: [
    'dist/js/ionic.js',
    'dist/js/angular/angular.js',
    'dist/js/angular/angular-animate.js',
    'dist/js/angular/angular-sanitize.js',
    'dist/js/angular-ui/angular-ui-router.js',
    'dist/js/ionic-angular.js'
  ]
};
