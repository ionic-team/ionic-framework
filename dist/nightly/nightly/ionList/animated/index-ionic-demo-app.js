var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "animated",
        "component": "ionList",
        "id": "ionList-animated",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<div ng-controller=\"AnimatedListCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">Animated List</h1>\n  </ion-header-bar>\n  <ion-content>\n    <ion-list show-delete=\"showDelete\">\n\n      <ion-item class=\"animated-item\"\n                ng-repeat=\"item in items\">\n        {{item}}\n        <div class=\"item-note\">\n          <a class=\"button button-small\"\n             ng-click=\"addItem($index)\">\n             Add\n          </a>\n          <a class=\"button button-small\"\n             ng-click=\"items.splice($index, 1)\">\n            Remove\n          </a>\n        </div>\n      </ion-item>\n\n    </ion-list>\n  </ion-content>\n</div>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionList/animated/index.html",
        "renderedContent": "\n<div ng-controller=\"AnimatedListCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <h1 class=\"title\">Animated List</h1>\n  </ion-header-bar>\n  <ion-content>\n    <ion-list show-delete=\"showDelete\">\n\n      <ion-item class=\"animated-item\"\n                ng-repeat=\"item in items\">\n        {{item}}\n        <div class=\"item-note\">\n          <a class=\"button button-small\"\n             ng-click=\"addItem($index)\">\n             Add\n          </a>\n          <a class=\"button button-small\"\n             ng-click=\"items.splice($index, 1)\">\n            Remove\n          </a>\n        </div>\n      </ion-item>\n\n    </ion-list>\n  </ion-content>\n</div>\n"
      }
    ],
    "js": [
      {
        "name": "animated",
        "component": "ionList",
        "id": "ionList-animated",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('animated', ['ionic'])\n.controller('AnimatedListCtrl', function($scope, $timeout) {\n  var nextItem = 0;\n  $scope.items = [];\n  for (var i=0; i < 5; i++) {\n    $scope.items.push('Item ' + (nextItem++));\n  }\n\n  $scope.addItem = function(atIndex) {\n    $scope.items.splice(atIndex + 1, 0, 'Item ' + nextItem);\n    nextItem++;\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionList/animated/index.js",
        "renderedContent": "\nangular.module('animated', ['ionic'])\n.controller('AnimatedListCtrl', function($scope, $timeout) {\n  var nextItem = 0;\n  $scope.items = [];\n  for (var i=0; i < 5; i++) {\n    $scope.items.push('Item ' + (nextItem++));\n  }\n\n  $scope.addItem = function(atIndex) {\n    $scope.items.splice(atIndex + 1, 0, 'Item ' + nextItem);\n    nextItem++;\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "animated",
        "component": "ionList",
        "id": "ionList-animated",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should add item below Item 0', function(){\n  var ele = element.all(by.css('.list .button'));\n  ele.get(0).click();\n});\n\nit('should remove Item 0', function(){\n  var ele = element.all(by.css('.list .button'));\n  ele.get(1).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionList/animated/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionList/animated/",
        "renderedContent": "describe('ionList-animated', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionList/animated/');\n});\n\n\n\nit('should add item below Item 0', function(){\n  var ele = element.all(by.css('.list .button'));\n  ele.get(0).click();\n});\n\nit('should remove Item 0', function(){\n  var ele = element.all(by.css('.list .button'));\n  ele.get(1).click();\n});\n\n});\n"
      }
    ],
    "css": [
      {
        "name": "animated",
        "component": "ionList",
        "id": "ionList-animated",
        "fileType": ".css",
        "fileName": "style.css",
        "contents": "\n.animated-item .item-note .button {\n  margin-top: 10px;\n}\n.animated-item {\n  line-height: 52px;\n  max-height: 52px;\n  padding-top: 0;\n  padding-bottom: 0;\n  -webkit-transition: all 0.15s linear;\n  -moz-transition: all 0.15s linear;\n  transition: all 0.15s linear;\n}\n.animated-item.ng-leave.ng-leave-active,\n.animated-item.ng-enter {\n  opacity: 0;\n  max-height: 0;\n}\n.animated-item.ng-leave,\n.animated-item.ng-enter.ng-enter-active {\n  opacity: 1;\n  max-height: 52px;\n}",
        "extension": "css",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionList/animated/style.css",
        "renderedContent": "\n.animated-item .item-note .button {\n  margin-top: 10px;\n}\n.animated-item {\n  line-height: 52px;\n  max-height: 52px;\n  padding-top: 0;\n  padding-bottom: 0;\n  -webkit-transition: all 0.15s linear;\n  -moz-transition: all 0.15s linear;\n  transition: all 0.15s linear;\n}\n.animated-item.ng-leave.ng-leave-active,\n.animated-item.ng-enter {\n  opacity: 0;\n  max-height: 0;\n}\n.animated-item.ng-leave,\n.animated-item.ng-enter.ng-enter-active {\n  opacity: 1;\n  max-height: 52px;\n}\n"
      }
    ]
  },
  "id": "ionList-animated",
  "name": "animated",
  "component": "ionList",
  "href": "/nightly/ionList/animated/"
};


angular.module('animated'
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
      .val(['<html ng-app="animated">',
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

