var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "forever",
        "component": "ionInfiniteScroll",
        "id": "ionInfiniteScroll-forever",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-header-bar>\n  <h1 class=\"title\">Scroll Down to Load More</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"ForeverCtrl\">\n  <div class=\"list\">\n    <div class=\"item\" ng-repeat=\"item in items\">\n      {{item}}\n    </div>\n  </div>\n\n  <ion-infinite-scroll on-infinite=\"loadMoreItems()\" icon=\"ion-loading-c\">\n  </ion-infinite-scroll>\n</ion-content>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionInfiniteScroll/forever/index.html",
        "renderedContent": "\n<ion-header-bar>\n  <h1 class=\"title\">Scroll Down to Load More</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"ForeverCtrl\">\n  <div class=\"list\">\n    <div class=\"item\" ng-repeat=\"item in items\">\n      {{item}}\n    </div>\n  </div>\n\n  <ion-infinite-scroll on-infinite=\"loadMoreItems()\" icon=\"ion-loading-c\">\n  </ion-infinite-scroll>\n</ion-content>\n"
      }
    ],
    "js": [
      {
        "name": "forever",
        "component": "ionInfiniteScroll",
        "id": "ionInfiniteScroll-forever",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('forever', ['ionic'])\n.controller('ForeverCtrl', function($scope, $timeout) {\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push(i);\n  }\n\n  //Load more after 1 second delay\n  $scope.loadMoreItems = function() {\n     var i = $scope.items.length;\n     var j = $scope.items.length + 5;\n     for (; i < j; i++) {\n       $scope.items.push('Item ' + i);\n     }\n     $scope.$broadcast('scroll.infiniteScrollComplete');\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionInfiniteScroll/forever/index.js",
        "renderedContent": "\nangular.module('forever', ['ionic'])\n.controller('ForeverCtrl', function($scope, $timeout) {\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push(i);\n  }\n\n  //Load more after 1 second delay\n  $scope.loadMoreItems = function() {\n     var i = $scope.items.length;\n     var j = $scope.items.length + 5;\n     for (; i < j; i++) {\n       $scope.items.push('Item ' + i);\n     }\n     $scope.$broadcast('scroll.infiniteScrollComplete');\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "forever",
        "component": "ionInfiniteScroll",
        "id": "ionInfiniteScroll-forever",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionInfiniteScroll/forever/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionInfiniteScroll/forever/",
        "renderedContent": "describe('ionInfiniteScroll-forever', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionInfiniteScroll/forever/');\n});\n\n\n\n});\n"
      }
    ]
  },
  "id": "ionInfiniteScroll-forever",
  "name": "forever",
  "component": "ionInfiniteScroll",
  "href": "/nightly/ionInfiniteScroll/forever/"
};


angular.module('forever'
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
      .val(['<html ng-app="forever">',
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

