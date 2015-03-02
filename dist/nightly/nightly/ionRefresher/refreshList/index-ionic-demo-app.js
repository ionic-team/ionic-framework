var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "refreshList",
        "component": "ionRefresher",
        "id": "ionRefresher-refreshList",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Pull to Refresh</h1>\n</ion-header-bar>\n\n<ion-content ng-controller=\"RefresherCtrl\">\n\n  <ion-refresher on-refresh=\"doRefresh()\"\n                 pulling-text=\"Pull...\"\n                 refreshing-text=\"Refreshing!\"\n                 refreshing-icon=\"ion-loading-c\">\n  </ion-refresher>\n\n  <ion-list>\n    <ion-item ng-repeat=\"item in items\">{{item}}</ion-item>\n  </ion-list>\n\n</ion-content>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionRefresher/refreshList/index.html",
        "renderedContent": "\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Pull to Refresh</h1>\n</ion-header-bar>\n\n<ion-content ng-controller=\"RefresherCtrl\">\n\n  <ion-refresher on-refresh=\"doRefresh()\"\n                 pulling-text=\"Pull...\"\n                 refreshing-text=\"Refreshing!\"\n                 refreshing-icon=\"ion-loading-c\">\n  </ion-refresher>\n\n  <ion-list>\n    <ion-item ng-repeat=\"item in items\">{{item}}</ion-item>\n  </ion-list>\n\n</ion-content>\n"
      }
    ],
    "js": [
      {
        "name": "refreshList",
        "component": "ionRefresher",
        "id": "ionRefresher-refreshList",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('refreshList', ['ionic'])\n.controller('RefresherCtrl', function($scope, $timeout) {\n  $scope.items = ['Item 1', 'Item 2', 'Item 3'];\n\n  $scope.doRefresh = function() {\n    $timeout(function() {\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.$broadcast('scroll.refreshComplete');\n    }, 1000);\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionRefresher/refreshList/index.js",
        "renderedContent": "\nangular.module('refreshList', ['ionic'])\n.controller('RefresherCtrl', function($scope, $timeout) {\n  $scope.items = ['Item 1', 'Item 2', 'Item 3'];\n\n  $scope.doRefresh = function() {\n    $timeout(function() {\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);\n      $scope.$broadcast('scroll.refreshComplete');\n    }, 1000);\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "refreshList",
        "component": "ionRefresher",
        "id": "ionRefresher-refreshList",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionRefresher/refreshList/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionRefresher/refreshList/",
        "renderedContent": "describe('ionRefresher-refreshList', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionRefresher/refreshList/');\n});\n\n\n\n});\n"
      }
    ]
  },
  "id": "ionRefresher-refreshList",
  "name": "refreshList",
  "component": "ionRefresher",
  "href": "/nightly/ionRefresher/refreshList/"
};


angular.module('refreshList'
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
      .val(['<html ng-app="refreshList">',
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

