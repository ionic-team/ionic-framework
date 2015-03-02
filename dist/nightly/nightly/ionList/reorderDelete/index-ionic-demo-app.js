var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "reorderDelete",
        "component": "ionList",
        "id": "ionList-reorderDelete",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<div ng-controller=\"ListCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <a class=\"button\" ng-click=\"toggleDelete()\">\n      Delete\n    </a>\n    <h1 class=\"title\">List</h1>\n    <a class=\"button\" ng-click=\"toggleReorder()\">\n      Reorder\n    </a>\n  </ion-header-bar>\n  <ion-content>\n    <ion-list show-delete=\"data.showDelete\"\n              show-reorder=\"data.showReorder\">\n      <ion-item ng-repeat=\"item in items\"\n                class=\"item-thumbnail-left\">\n\n        <img src=\"\" style=\"background:black; width:80px; height:80px;\">\n        <h2>Item {{item}}</h2>\n        <p>Here's an item description.</p>\n        <ion-option-button class=\"button-positive\"\n                           ng-click=\"share(item)\">\n          Share\n        </ion-option-button>\n        <ion-option-button class=\"button-info\"\n                           ng-click=\"edit(item)\">\n          Edit\n        </ion-option-button>\n        <ion-delete-button class=\"ion-minus-circled\"\n                           ng-click=\"items.splice($index, 1)\">\n        </ion-delete-button>\n        <ion-reorder-button class=\"ion-navicon\"\n                            on-reorder=\"reorderItem(item, $fromIndex, $toIndex)\">\n        </ion-reorder-button>\n\n      </ion-item>\n    </ion-list>\n  </ion-content>\n</div>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionList/reorderDelete/index.html",
        "renderedContent": "\n<div ng-controller=\"ListCtrl\">\n  <ion-header-bar class=\"bar-positive\">\n    <a class=\"button\" ng-click=\"toggleDelete()\">\n      Delete\n    </a>\n    <h1 class=\"title\">List</h1>\n    <a class=\"button\" ng-click=\"toggleReorder()\">\n      Reorder\n    </a>\n  </ion-header-bar>\n  <ion-content>\n    <ion-list show-delete=\"data.showDelete\"\n              show-reorder=\"data.showReorder\">\n      <ion-item ng-repeat=\"item in items\"\n                class=\"item-thumbnail-left\">\n\n        <img src=\"\" style=\"background:black; width:80px; height:80px;\">\n        <h2>Item {{item}}</h2>\n        <p>Here's an item description.</p>\n        <ion-option-button class=\"button-positive\"\n                           ng-click=\"share(item)\">\n          Share\n        </ion-option-button>\n        <ion-option-button class=\"button-info\"\n                           ng-click=\"edit(item)\">\n          Edit\n        </ion-option-button>\n        <ion-delete-button class=\"ion-minus-circled\"\n                           ng-click=\"items.splice($index, 1)\">\n        </ion-delete-button>\n        <ion-reorder-button class=\"ion-navicon\"\n                            on-reorder=\"reorderItem(item, $fromIndex, $toIndex)\">\n        </ion-reorder-button>\n\n      </ion-item>\n    </ion-list>\n  </ion-content>\n</div>\n"
      }
    ],
    "js": [
      {
        "name": "reorderDelete",
        "component": "ionList",
        "id": "ionList-reorderDelete",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('reorderDelete', ['ionic'])\n.controller('ListCtrl', function($scope, $ionicPopup) {\n  $scope.data = {\n    showReorder: false,\n    showDelete: false\n  };\n\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push(i);\n  }\n\n  $scope.toggleDelete = function() {\n    $scope.data.showReorder = false;\n    $scope.data.showDelete = !$scope.data.showDelete;\n  };\n  $scope.toggleReorder = function() {\n    $scope.data.showDelete = false;\n    $scope.data.showReorder = !$scope.data.showReorder;\n  };\n\n  $scope.share = function(item) {\n    alert('Sharing ' + item);\n  };\n  $scope.edit = function(item) {\n    alert('Editing ' + item);\n  };\n\n  $scope.reorderItem = function(item, fromIndex, toIndex) {\n    $scope.items.splice(fromIndex, 1)\n    $scope.items.splice(toIndex, 0, item)\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionList/reorderDelete/index.js",
        "renderedContent": "\nangular.module('reorderDelete', ['ionic'])\n.controller('ListCtrl', function($scope, $ionicPopup) {\n  $scope.data = {\n    showReorder: false,\n    showDelete: false\n  };\n\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push(i);\n  }\n\n  $scope.toggleDelete = function() {\n    $scope.data.showReorder = false;\n    $scope.data.showDelete = !$scope.data.showDelete;\n  };\n  $scope.toggleReorder = function() {\n    $scope.data.showDelete = false;\n    $scope.data.showReorder = !$scope.data.showReorder;\n  };\n\n  $scope.share = function(item) {\n    alert('Sharing ' + item);\n  };\n  $scope.edit = function(item) {\n    alert('Editing ' + item);\n  };\n\n  $scope.reorderItem = function(item, fromIndex, toIndex) {\n    $scope.items.splice(fromIndex, 1)\n    $scope.items.splice(toIndex, 0, item)\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "reorderDelete",
        "component": "ionList",
        "id": "ionList-reorderDelete",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should show reorder icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(1).click();\n});\n\nit('should hide reorder icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(1).click();\n});\n\nit('should show delete icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should hide delete icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionList/reorderDelete/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionList/reorderDelete/",
        "renderedContent": "describe('ionList-reorderDelete', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionList/reorderDelete/');\n});\n\n\n\nit('should show reorder icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(1).click();\n});\n\nit('should hide reorder icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(1).click();\n});\n\nit('should show delete icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\nit('should hide delete icons', function(){\n  var ele = element.all(by.css('.bar-header .button'));\n  ele.get(0).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "ionList-reorderDelete",
  "name": "reorderDelete",
  "component": "ionList",
  "href": "/nightly/ionList/reorderDelete/"
};


angular.module('reorderDelete'
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
      .val(['<html ng-app="reorderDelete">',
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

