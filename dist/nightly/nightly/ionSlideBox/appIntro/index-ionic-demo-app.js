var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "appIntro",
        "component": "ionSlideBox",
        "id": "ionSlideBox-appIntro",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-nav-bar class=\"nav-title-slide-ios7 bar-light\">\n  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n  </ion-nav-back-button>\n</ion-nav-bar>\n\n<ion-nav-view animation=\"slide-left-right-ios7\"></ion-nav-view>\n\n<script id=\"intro.html\" type=\"text/ng-template\">\n  <ion-view>\n\n    <ion-nav-buttons side=\"left\">\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"startApp()\" ng-if=\"!slideIndex\">\n        Skip Intro\n      </button>\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"previous()\" ng-if=\"slideIndex > 0\">\n        Previous Slide\n      </button>\n    </ion-nav-buttons>\n    <ion-nav-buttons side=\"right\">\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"next()\" ng-if=\"slideIndex != 2\">\n        Next\n      </button>\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"startApp()\" ng-if=\"slideIndex == 2\">\n        Start using MyApp\n      </button>\n    </ion-nav-buttons>\n\n    <ion-slide-box on-slide-changed=\"slideChanged($index)\">\n      <ion-slide>\n        <h3>Thank you for choosing the Awesome App!</h3>\n        <div id=\"logo\">\n          <img src=\"\" style=\"background: black; width: 152px; height: 152px;\">\n        </div>\n        <p>\n          We've worked super hard to make you happy.\n        </p>\n        <p>\n          But if you are angry, too bad.\n        </p>\n      </ion-slide>\n      <ion-slide>\n        <h3>Using Awesome</h3>\n\n        <div id=\"list\">\n          <h5>Just three steps:</h5>\n          <ol>\n            <li>Be awesome</li>\n            <li>Stay awesome</li>\n            <li>There is no step 3</li>\n          </ol>\n        </div>\n      </ion-slide>\n      <ion-slide>\n        <h3>Any questions?</h3>\n        <p>\n          Too bad!\n        </p>\n      </ion-slide>\n    </ion-slide-box>\n\n  </ion-view>\n</script>\n\n<script id=\"main.html\" type=\"text/ng-template\">\n  <ion-view hide-back-button=\"true\" title=\"Awesome\">\n    <ion-content padding=\"true\">\n      <h1>Main app here</h1>\n      <button class=\"button\" ng-click=\"toIntro()\">Do Tutorial Again</button>\n    </ion-content>\n  </ion-view>\n</script>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSlideBox/appIntro/index.html",
        "renderedContent": "\n<ion-nav-bar class=\"nav-title-slide-ios7 bar-light\">\n  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n  </ion-nav-back-button>\n</ion-nav-bar>\n\n<ion-nav-view animation=\"slide-left-right-ios7\"></ion-nav-view>\n\n<script id=\"intro.html\" type=\"text/ng-template\">\n  <ion-view>\n\n    <ion-nav-buttons side=\"left\">\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"startApp()\" ng-if=\"!slideIndex\">\n        Skip Intro\n      </button>\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"previous()\" ng-if=\"slideIndex > 0\">\n        Previous Slide\n      </button>\n    </ion-nav-buttons>\n    <ion-nav-buttons side=\"right\">\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"next()\" ng-if=\"slideIndex != 2\">\n        Next\n      </button>\n      <button class=\"button button-positive button-clear no-animation\"\n              ng-click=\"startApp()\" ng-if=\"slideIndex == 2\">\n        Start using MyApp\n      </button>\n    </ion-nav-buttons>\n\n    <ion-slide-box on-slide-changed=\"slideChanged($index)\">\n      <ion-slide>\n        <h3>Thank you for choosing the Awesome App!</h3>\n        <div id=\"logo\">\n          <img src=\"\" style=\"background: black; width: 152px; height: 152px;\">\n        </div>\n        <p>\n          We've worked super hard to make you happy.\n        </p>\n        <p>\n          But if you are angry, too bad.\n        </p>\n      </ion-slide>\n      <ion-slide>\n        <h3>Using Awesome</h3>\n\n        <div id=\"list\">\n          <h5>Just three steps:</h5>\n          <ol>\n            <li>Be awesome</li>\n            <li>Stay awesome</li>\n            <li>There is no step 3</li>\n          </ol>\n        </div>\n      </ion-slide>\n      <ion-slide>\n        <h3>Any questions?</h3>\n        <p>\n          Too bad!\n        </p>\n      </ion-slide>\n    </ion-slide-box>\n\n  </ion-view>\n</script>\n\n<script id=\"main.html\" type=\"text/ng-template\">\n  <ion-view hide-back-button=\"true\" title=\"Awesome\">\n    <ion-content padding=\"true\">\n      <h1>Main app here</h1>\n      <button class=\"button\" ng-click=\"toIntro()\">Do Tutorial Again</button>\n    </ion-content>\n  </ion-view>\n</script>\n"
      }
    ],
    "js": [
      {
        "name": "appIntro",
        "component": "ionSlideBox",
        "id": "ionSlideBox-appIntro",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('appIntro', ['ionic'])\n\n.config(function ($stateProvider, $urlRouterProvider) {\n\n  $stateProvider\n    .state('intro', {\n      url: '/',\n      templateUrl: 'intro.html',\n      controller: 'IntroCtrl'\n    })\n    .state('main', {\n      url: '/main',\n      templateUrl: 'main.html',\n      controller: 'MainCtrl'\n    });\n\n  $urlRouterProvider.otherwise(\"/\");\n\n})\n\n.controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {\n\n  // Called to navigate to the main app\n  $scope.startApp = function () {\n    $state.go('main');\n  };\n  $scope.next = function () {\n    $ionicSlideBoxDelegate.select($ionicSlideBoxDelegate.next());\n  };\n  $scope.previous = function () {\n    $ionicSlideBoxDelegate.select($ionicSlideBoxDelegate.previous());\n  };\n\n  // Called each time the slide changes\n  $scope.slideChanged = function (index) {\n    $scope.slideIndex = index;\n  };\n})\n\n.controller('MainCtrl', function ($scope, $state) {\n  $scope.toIntro = function () {\n    $state.go('intro');\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSlideBox/appIntro/index.js",
        "renderedContent": "\nangular.module('appIntro', ['ionic'])\n\n.config(function ($stateProvider, $urlRouterProvider) {\n\n  $stateProvider\n    .state('intro', {\n      url: '/',\n      templateUrl: 'intro.html',\n      controller: 'IntroCtrl'\n    })\n    .state('main', {\n      url: '/main',\n      templateUrl: 'main.html',\n      controller: 'MainCtrl'\n    });\n\n  $urlRouterProvider.otherwise(\"/\");\n\n})\n\n.controller('IntroCtrl', function ($scope, $state, $ionicSlideBoxDelegate) {\n\n  // Called to navigate to the main app\n  $scope.startApp = function () {\n    $state.go('main');\n  };\n  $scope.next = function () {\n    $ionicSlideBoxDelegate.select($ionicSlideBoxDelegate.next());\n  };\n  $scope.previous = function () {\n    $ionicSlideBoxDelegate.select($ionicSlideBoxDelegate.previous());\n  };\n\n  // Called each time the slide changes\n  $scope.slideChanged = function (index) {\n    $scope.slideIndex = index;\n  };\n})\n\n.controller('MainCtrl', function ($scope, $state) {\n  $scope.toIntro = function () {\n    $state.go('intro');\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "appIntro",
        "component": "ionSlideBox",
        "id": "ionSlideBox-appIntro",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\nit('should go to slide 2', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should go to slide 1', function(){\n  var ele = element(by.css('.left-buttons .button'));\n  ele.click();\n});\n\nit('should go to slide 2', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should go to slide 3', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should go to main app', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should start over', function(){\n  var ele = element(by.css('ion-nav-view .button'));\n  ele.click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionSlideBox/appIntro/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionSlideBox/appIntro/",
        "renderedContent": "describe('ionSlideBox-appIntro', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionSlideBox/appIntro/');\n});\n\n\nit('should go to slide 2', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should go to slide 1', function(){\n  var ele = element(by.css('.left-buttons .button'));\n  ele.click();\n});\n\nit('should go to slide 2', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should go to slide 3', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should go to main app', function(){\n  var ele = element(by.css('.right-buttons .button'));\n  ele.click();\n});\n\nit('should start over', function(){\n  var ele = element(by.css('ion-nav-view .button'));\n  ele.click();\n});\n\n});\n"
      }
    ],
    "css": [
      {
        "name": "appIntro",
        "component": "ionSlideBox",
        "id": "ionSlideBox-appIntro",
        "fileType": ".css",
        "fileName": "style.css",
        "contents": "\n.slider {\n  height: 100%;\n}\n.slider-slide {\n  padding-top: 80px;\n  background-color: #fff;\n  color: #000;\n  text-align: center;\n  font-weight: 300;\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\n}\n#logo {\n  margin: 30px 0px;\n}\n#list {\n  margin: 30px auto;\n  width: 170px;\n  font-size: 20px;\n}\n#list ol {\n  margin-top: 30px;\n}\n#list ol li {\n  margin: 10px 0px;\n  list-style: decimal;\n  text-align: left;\n}",
        "extension": "css",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSlideBox/appIntro/style.css",
        "renderedContent": "\n.slider {\n  height: 100%;\n}\n.slider-slide {\n  padding-top: 80px;\n  background-color: #fff;\n  color: #000;\n  text-align: center;\n  font-weight: 300;\n  font-family: \"HelveticaNeue-Light\", \"Helvetica Neue Light\", \"Helvetica Neue\", Helvetica, Arial, \"Lucida Grande\", sans-serif;\n}\n#logo {\n  margin: 30px 0px;\n}\n#list {\n  margin: 30px auto;\n  width: 170px;\n  font-size: 20px;\n}\n#list ol {\n  margin-top: 30px;\n}\n#list ol li {\n  margin: 10px 0px;\n  list-style: decimal;\n  text-align: left;\n}\n"
      }
    ]
  },
  "id": "ionSlideBox-appIntro",
  "name": "appIntro",
  "component": "ionSlideBox",
  "href": "/nightly/ionSlideBox/appIntro/"
};


angular.module('appIntro'
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
      .val(['<html ng-app="appIntro">',
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

