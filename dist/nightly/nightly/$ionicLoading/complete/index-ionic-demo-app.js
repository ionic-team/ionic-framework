var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "complete",
        "component": "$ionicLoading",
        "id": "$ionicLoading-complete",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<div ng-controller=\"LoadingCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">Loading Demo</h1>\n    <a class=\"button\" ng-click=\"showLoading()\">\n      <i class=\"icon ion-more\"></i> Load\n    </a>\n  </ion-header-bar>\n  <ion-content>\n    <div class=\"list\">\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Duration (ms)</span>\n        <input type=\"number\" ng-model=\"loadingOptions.duration\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Delay (ms)</span>\n        <input type=\"number\" ng-model=\"loadingOptions.delay\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Template</span>\n        <textarea rows=\"3\" ng-model=\"loadingOptions.template\"></textarea>\n      </label>\n      <ion-toggle class=\"item item-toggle\"\n                  ng-model=\"loadingOptions.noBackdrop\">\n        Hide Backdrop?\n      </ion-toggle>\n    </div>\n  </ion-content>\n</div>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/$ionicLoading/complete/index.html",
        "renderedContent": "\n<div ng-controller=\"LoadingCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">Loading Demo</h1>\n    <a class=\"button\" ng-click=\"showLoading()\">\n      <i class=\"icon ion-more\"></i> Load\n    </a>\n  </ion-header-bar>\n  <ion-content>\n    <div class=\"list\">\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Duration (ms)</span>\n        <input type=\"number\" ng-model=\"loadingOptions.duration\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Delay (ms)</span>\n        <input type=\"number\" ng-model=\"loadingOptions.delay\">\n      </label>\n      <label class=\"item item-input item-stacked-label\">\n        <span class=\"input-label\">Loading Template</span>\n        <textarea rows=\"3\" ng-model=\"loadingOptions.template\"></textarea>\n      </label>\n      <ion-toggle class=\"item item-toggle\"\n                  ng-model=\"loadingOptions.noBackdrop\">\n        Hide Backdrop?\n      </ion-toggle>\n    </div>\n  </ion-content>\n</div>\n"
      }
    ],
    "js": [
      {
        "name": "complete",
        "component": "$ionicLoading",
        "id": "$ionicLoading-complete",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('complete', ['ionic'])\n.controller('LoadingCtrl', function($scope, $ionicLoading) {\n  $scope.loadingOptions = {\n    duration: 1000,\n    delay: 0,\n    template: '<i class=\"icon ion-loading-c\"></i>\\n<br/>\\nLoading...',\n    noBackdrop: false\n  };\n  $scope.showLoading = function() {\n    $ionicLoading.show($scope.loadingOptions);\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/$ionicLoading/complete/index.js",
        "renderedContent": "\nangular.module('complete', ['ionic'])\n.controller('LoadingCtrl', function($scope, $ionicLoading) {\n  $scope.loadingOptions = {\n    duration: 1000,\n    delay: 0,\n    template: '<i class=\"icon ion-loading-c\"></i>\\n<br/>\\nLoading...',\n    noBackdrop: false\n  };\n  $scope.showLoading = function() {\n    $ionicLoading.show($scope.loadingOptions);\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "complete",
        "component": "$ionicLoading",
        "id": "$ionicLoading-complete",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/$ionicLoading/complete/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/$ionicLoading/complete/",
        "renderedContent": "describe('$ionicLoading-complete', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/$ionicLoading/complete/');\n});\n\n\n\n});\n"
      }
    ]
  },
  "id": "$ionicLoading-complete",
  "name": "complete",
  "component": "$ionicLoading",
  "href": "/nightly/$ionicLoading/complete/"
};


angular.module('complete'
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
      .val(['<html ng-app="complete">',
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

