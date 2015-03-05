var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "popover",
        "component": "$ionicPopover",
        "id": "$ionicPopover-popover",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n\n<ion-header-bar class=\"bar-positive\" title=\"Popover\" ng-controller=\"HeaderCtrl\">\n  <div class=\"buttons\">\n    <button class=\"button button-icon ion-android-more\" ng-click=\"openPopover($event)\" id=\"icon-btn\"></button>\n  </div>\n  <h1 class=\"title\">Popover</h1>\n  <div class=\"buttons\">\n    <button class=\"button\" ng-click=\"openPopover2($event)\" id=\"mid-btn\">Popover 2</button>\n    <button class=\"button\" ng-click=\"openPopover($event)\" id=\"right-btn\">Popover</button>\n  </div>\n</ion-header-bar>\n\n<ion-content class=\"padding has-header\" ng-controller=\"PlatformCtrl\">\n  <p>\n    <button class=\"button\" ng-click=\"setPlatform('ios')\" id=\"ios\">iOS</button>\n    <button class=\"button\" ng-click=\"setPlatform('android')\" id=\"android\">Android</button>\n    <button class=\"button\" ng-click=\"setPlatform('base')\" id=\"base\">Base</button>\n  </p>\n</ion-content>\n\n<script id=\"popover.html\" type=\"text/ng-template\">\n  <ion-popover-view>\n    <ion-header-bar>\n      <h1 class=\"title\">Popover Header</h1>\n    </ion-header-bar>\n    <ion-content>\n      <div class=\"list\">\n        <label class=\"item item-input\">\n          <span class=\"input-label\">First Name</span>\n          <input type=\"text\" placeholder=\"\">\n        </label>\n        <label class=\"item item-input\">\n          <span class=\"input-label\">Last Name</span>\n          <input type=\"text\" placeholder=\"\">\n        </label>\n        <label class=\"item item-input\">\n          <span class=\"input-label\">Email</span>\n          <input type=\"text\" placeholder=\"\">\n        </label>\n        <button class=\"button button-block button-positive\">Submit</button>\n      </div>\n    </ion-content>\n  </ion-popover-view>\n</script>\n\n\n<script id=\"popover2.html\" type=\"text/ng-template\">\n  <ion-popover-view>\n    <ion-content>\n      <div class=\"list\">\n        <div class=\"item\">\n          Item 1\n        </div>\n        <div class=\"item\">\n          Item 2\n        </div>\n        <div class=\"item\">\n          Item 3\n        </div>\n        <div class=\"item\">\n          Item 4\n        </div>\n        <div class=\"item\">\n          Item 5\n        </div>\n        <div class=\"item\">\n          Item 6\n        </div>\n      </div>\n    </ion-content>\n  </ion-popover-view>\n</script>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/$ionicPopover/popover/index.html",
        "renderedContent": "\n\n<ion-header-bar class=\"bar-positive\" title=\"Popover\" ng-controller=\"HeaderCtrl\">\n  <div class=\"buttons\">\n    <button class=\"button button-icon ion-android-more\" ng-click=\"openPopover($event)\" id=\"icon-btn\"></button>\n  </div>\n  <h1 class=\"title\">Popover</h1>\n  <div class=\"buttons\">\n    <button class=\"button\" ng-click=\"openPopover2($event)\" id=\"mid-btn\">Popover 2</button>\n    <button class=\"button\" ng-click=\"openPopover($event)\" id=\"right-btn\">Popover</button>\n  </div>\n</ion-header-bar>\n\n<ion-content class=\"padding has-header\" ng-controller=\"PlatformCtrl\">\n  <p>\n    <button class=\"button\" ng-click=\"setPlatform('ios')\" id=\"ios\">iOS</button>\n    <button class=\"button\" ng-click=\"setPlatform('android')\" id=\"android\">Android</button>\n    <button class=\"button\" ng-click=\"setPlatform('base')\" id=\"base\">Base</button>\n  </p>\n</ion-content>\n\n<script id=\"popover.html\" type=\"text/ng-template\">\n  <ion-popover-view>\n    <ion-header-bar>\n      <h1 class=\"title\">Popover Header</h1>\n    </ion-header-bar>\n    <ion-content>\n      <div class=\"list\">\n        <label class=\"item item-input\">\n          <span class=\"input-label\">First Name</span>\n          <input type=\"text\" placeholder=\"\">\n        </label>\n        <label class=\"item item-input\">\n          <span class=\"input-label\">Last Name</span>\n          <input type=\"text\" placeholder=\"\">\n        </label>\n        <label class=\"item item-input\">\n          <span class=\"input-label\">Email</span>\n          <input type=\"text\" placeholder=\"\">\n        </label>\n        <button class=\"button button-block button-positive\">Submit</button>\n      </div>\n    </ion-content>\n  </ion-popover-view>\n</script>\n\n\n<script id=\"popover2.html\" type=\"text/ng-template\">\n  <ion-popover-view>\n    <ion-content>\n      <div class=\"list\">\n        <div class=\"item\">\n          Item 1\n        </div>\n        <div class=\"item\">\n          Item 2\n        </div>\n        <div class=\"item\">\n          Item 3\n        </div>\n        <div class=\"item\">\n          Item 4\n        </div>\n        <div class=\"item\">\n          Item 5\n        </div>\n        <div class=\"item\">\n          Item 6\n        </div>\n      </div>\n    </ion-content>\n  </ion-popover-view>\n</script>\n"
      }
    ],
    "js": [
      {
        "name": "popover",
        "component": "$ionicPopover",
        "id": "$ionicPopover-popover",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\n\nangular.module('popover', ['ionic'])\n\n.controller('HeaderCtrl', function($scope, $ionicPopover) {\n\n  $scope.openPopover = function($event) {\n    $scope.popover.show($event);\n  };\n  $ionicPopover.fromTemplateUrl('popover.html', function(popover) {\n    $scope.popover = popover;\n  });\n\n  $scope.openPopover2 = function($event) {\n    $scope.popover2.show($event);\n  };\n  $ionicPopover.fromTemplateUrl('popover2.html', function(popover) {\n    $scope.popover2 = popover;\n  });\n})\n\n.controller('PlatformCtrl', function($scope, $ionicPopover) {\n\n  $scope.setPlatform = function(p) {\n    document.body.classList.remove('platform-ios');\n    document.body.classList.remove('platform-android');\n    document.body.classList.add('platform-' + p);\n  };\n\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/$ionicPopover/popover/index.js",
        "renderedContent": "\n\nangular.module('popover', ['ionic'])\n\n.controller('HeaderCtrl', function($scope, $ionicPopover) {\n\n  $scope.openPopover = function($event) {\n    $scope.popover.show($event);\n  };\n  $ionicPopover.fromTemplateUrl('popover.html', function(popover) {\n    $scope.popover = popover;\n  });\n\n  $scope.openPopover2 = function($event) {\n    $scope.popover2.show($event);\n  };\n  $ionicPopover.fromTemplateUrl('popover2.html', function(popover) {\n    $scope.popover2 = popover;\n  });\n})\n\n.controller('PlatformCtrl', function($scope, $ionicPopover) {\n\n  $scope.setPlatform = function(p) {\n    document.body.classList.remove('platform-ios');\n    document.body.classList.remove('platform-android');\n    document.body.classList.add('platform-' + p);\n  };\n\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "popover",
        "component": "$ionicPopover",
        "id": "$ionicPopover-popover",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should open left side ios popover', function(){\n  element(by.css('#ios')).click();\n  element(by.css('#icon-btn')).click();\n});\n\nit('should close ios popover when clicking backdrop', function(){\n  element(by.css('.popover-backdrop.active')).click();\n});\n\nit('should open middle ios popover', function(){\n  element(by.css('#mid-btn')).click();\n});\n\nit('should open right ios popover', function(){\n  element(by.css('.popover-backdrop.active')).click();\n  element(by.css('#right-btn')).click();\n});\n\nit('should open left side android popover', function(){\n  element(by.css('.popover-backdrop.active')).click();\n  element(by.css('#android')).click();\n  element(by.css('#icon-btn')).click();\n});\n\nit('should close android popover when clicking backdrop', function(){\n  element(by.css('.popover-backdrop.active')).click();\n});\n\nit('should open middle android popover', function(){\n  element(by.css('#mid-btn')).click();\n});\n\nit('should open right android popover', function(){\n  element(by.css('.popover-backdrop.active')).click();\n  element(by.css('#right-btn')).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/$ionicPopover/popover/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/$ionicPopover/popover/",
        "renderedContent": "describe('$ionicPopover-popover', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/$ionicPopover/popover/');\n});\n\n\n\nit('should open left side ios popover', function(){\n  element(by.css('#ios')).click();\n  element(by.css('#icon-btn')).click();\n});\n\nit('should close ios popover when clicking backdrop', function(){\n  element(by.css('.popover-backdrop.active')).click();\n});\n\nit('should open middle ios popover', function(){\n  element(by.css('#mid-btn')).click();\n});\n\nit('should open right ios popover', function(){\n  element(by.css('.popover-backdrop.active')).click();\n  element(by.css('#right-btn')).click();\n});\n\nit('should open left side android popover', function(){\n  element(by.css('.popover-backdrop.active')).click();\n  element(by.css('#android')).click();\n  element(by.css('#icon-btn')).click();\n});\n\nit('should close android popover when clicking backdrop', function(){\n  element(by.css('.popover-backdrop.active')).click();\n});\n\nit('should open middle android popover', function(){\n  element(by.css('#mid-btn')).click();\n});\n\nit('should open right android popover', function(){\n  element(by.css('.popover-backdrop.active')).click();\n  element(by.css('#right-btn')).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "$ionicPopover-popover",
  "name": "popover",
  "component": "$ionicPopover",
  "href": "/nightly/$ionicPopover/popover/"
};


angular.module('popover'
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
      .val(['<html ng-app="popover">',
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

