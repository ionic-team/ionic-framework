var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "simple",
        "component": "ionSideMenus",
        "id": "ionSideMenus-simple",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-side-menus ng-controller=\"SideMenusSimpleCtrl\">\n\n  <ion-side-menu-content>\n    <ion-header-bar class=\"bar-positive\">\n      <div class=\"buttons\">\n        <div class=\"button button-clear\" ng-click=\"toggleLeft()\">\n          <i class=\"icon ion-navicon\"></i>\n        </div>\n      </div>\n      <h1 class=\"title\">\n        Side\n      </h1>\n    </ion-header-bar>\n    <ion-content class=\"padding\">\n      <p>Slide the content or press the button on the header to open a side menu.</p>\n    </ion-content>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"left\">\n    <ion-header-bar class=\"bar-positive\">\n    </ion-header-bar>\n    <ion-content>\n      <a class=\"item\" ng-click=\"toggleLeft()\">\n        Close Menu\n      </a>\n    </ion-content>\n  </ion-side-menu>\n\n</ion-side-menus>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSideMenus/simple/index.html",
        "renderedContent": "\n<ion-side-menus ng-controller=\"SideMenusSimpleCtrl\">\n\n  <ion-side-menu-content>\n    <ion-header-bar class=\"bar-positive\">\n      <div class=\"buttons\">\n        <div class=\"button button-clear\" ng-click=\"toggleLeft()\">\n          <i class=\"icon ion-navicon\"></i>\n        </div>\n      </div>\n      <h1 class=\"title\">\n        Side\n      </h1>\n    </ion-header-bar>\n    <ion-content class=\"padding\">\n      <p>Slide the content or press the button on the header to open a side menu.</p>\n    </ion-content>\n  </ion-side-menu-content>\n\n  <ion-side-menu side=\"left\">\n    <ion-header-bar class=\"bar-positive\">\n    </ion-header-bar>\n    <ion-content>\n      <a class=\"item\" ng-click=\"toggleLeft()\">\n        Close Menu\n      </a>\n    </ion-content>\n  </ion-side-menu>\n\n</ion-side-menus>\n"
      }
    ],
    "js": [
      {
        "name": "simple",
        "component": "ionSideMenus",
        "id": "ionSideMenus-simple",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nvar app = angular.module('simple', ['ionic']);\napp.controller('SideMenusSimpleCtrl', function($scope, $ionicSideMenuDelegate) {\n\n  $scope.toggleLeft = function() {\n    $ionicSideMenuDelegate.toggleLeft();\n  };\n\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSideMenus/simple/index.js",
        "renderedContent": "\nvar app = angular.module('simple', ['ionic']);\napp.controller('SideMenusSimpleCtrl', function($scope, $ionicSideMenuDelegate) {\n\n  $scope.toggleLeft = function() {\n    $ionicSideMenuDelegate.toggleLeft();\n  };\n\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "simple",
        "component": "ionSideMenus",
        "id": "ionSideMenus-simple",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\nit('should show left menu', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should hide left menu by clicking header button', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should show left menu', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should hide left menu by close menu item', function(){\n  var ele = element.all(by.css('ion-side-menu[side=\"left\"] a'));\n  ele.get(0).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionSideMenus/simple/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionSideMenus/simple/",
        "renderedContent": "describe('ionSideMenus-simple', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionSideMenus/simple/');\n});\n\n\nit('should show left menu', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should hide left menu by clicking header button', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should show left menu', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should hide left menu by close menu item', function(){\n  var ele = element.all(by.css('ion-side-menu[side=\"left\"] a'));\n  ele.get(0).click();\n});\n\n});\n"
      }
    ],
    "css": [
      {
        "name": "simple",
        "component": "ionSideMenus",
        "id": "ionSideMenus-simple",
        "fileType": ".css",
        "fileName": "style.css",
        "contents": "\n.menu-left .scroll-content {\n  background-color: #f4f4f4;\n}",
        "extension": "css",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSideMenus/simple/style.css",
        "renderedContent": "\n.menu-left .scroll-content {\n  background-color: #f4f4f4;\n}\n"
      }
    ]
  },
  "id": "ionSideMenus-simple",
  "name": "simple",
  "component": "ionSideMenus",
  "href": "/nightly/ionSideMenus/simple/"
};


angular.module('simple'
  )
.controller('IonicDemoCtrl', function($scope, $ionicModal, $ionicLoading) {
  $scope.$demos = DEMOS;

  
    $scope.$demo = DEMO;
    $ionicModal.fromTemplateUrl('ionic-demo-modal.html', {
      scope: $scope,
      focusFirstInput: false
    }).then(function(modal) {
      $scope.$demoModal = modal;
    });

    //don't try this at home
    ionic.onGesture('dragup', function(e) {
      if (e.gesture.distance > 35 && !$scope.$demoModal.isShown()) {
        $scope.$apply(function(e) {
          $scope.$demoModal.show();
        });
      }
    }, document.querySelector('.demo-footer'));

    $scope.demoScratch = function(demo) {
      var form = angular.element('<form method="POST" action="http://scratch.ionicsdk.com/embed" target="_blank">');

      var htmlInput = angular.element('<textarea type="text" name="html">')
      .val(['<html ng-app="simple">',
           '<head>',
           '  <meta charset="utf-8">',
           '  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">',
           '  <link rel="stylesheet" href="http://code.ionicframework.com/nightly/css/ionic.css">',
           '  <script src="http://code.ionicframework.com/nightly/js/ionic.bundle.js"></script>',
           '</head>',
           '<body>',
           (demo.files.html || []).map(function(file) {
             return file.contents;
           }).join('\n'),
           '</body>',
           '</html>'].join('\n'));

           var cssInput = angular.element('<textarea type="text" name="css">')
           .val((demo.files.css || []).map(function(file) {
             return file.contents;
           }).join('\n'));

           var jsInput = angular.element('<textarea type="text" name="js">')
           .val((demo.files.js || []).map(function(file) {
             return file.contents;
           }).join('\n'));

           form
             .css('display','none')
             .append(htmlInput)
             .append(cssInput)
             .append(jsInput);

           document.body.appendChild(form[0]);
           form[0].submit();
    };
    
})
.filter('humanize', function() {
  return function(input) {
    return input.charAt(0).toUpperCase() +
      input.substring(1).replace(/[A-Z]/g, function(match, i) {
        return ' ' + match.toUpperCase();
      });
  };
});

