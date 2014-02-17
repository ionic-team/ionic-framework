module.exports = {
  ionicFiles: [
    'js/_license.js',

    // Base
    'js/ionic.js',

    // Utils
    'js/utils/animate.js',
    'js/utils/dom.js',
    'js/utils/events.js',
    'js/utils/gestures.js',
    'js/utils/platform.js',
    'js/utils/poly.js',
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
    'js/views/popupView.js',
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
    'js/_license.js',
    'js/ext/angular/src/ionicAngular.js',
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
    'js/angular/angular.js',
    'js/angular/angular.min.js',
    'js/angular-ui/angular-ui-router.js',
    'js/angular-ui/angular-ui-router.min.js',
    'fonts/ionicons.eot',
    'fonts/ionicons.svg',
    'fonts/ionicons.ttf',
    'fonts/ionicons.woff'
  ]
};
