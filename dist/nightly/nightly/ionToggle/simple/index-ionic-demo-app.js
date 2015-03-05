var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "simple",
        "component": "ionToggle",
        "id": "ionToggle-simple",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">\n    Toggle: Simple Usage\n  </h1>\n</ion-header-bar>\n<ion-content ng-controller=\"MainCtrl\" class=\"padding\">\n  <h4>Your pizza has {{toppings()}}!</h4>\n  <ion-toggle ng-model=\"pizza.pepperoni\">\n    Pepperoni?\n  </ion-toggle>\n  <ion-toggle ng-model=\"pizza.sausage\" toggle-class=\"toggle-energized\">\n    Sausage?\n  </ion-toggle>\n  <ion-toggle ng-model=\"pizza.jalapenos\" toggle-class=\"toggle-calm\">\n    Jalapeno?\n  </ion-toggle>\n  <ion-toggle ng-model=\"pizza.anchovies\" toggle-class=\"toggle-royal\">\n    Anchovies?\n  </ion-toggle>\n</ion-content>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionToggle/simple/index.html",
        "renderedContent": "\n\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">\n    Toggle: Simple Usage\n  </h1>\n</ion-header-bar>\n<ion-content ng-controller=\"MainCtrl\" class=\"padding\">\n  <h4>Your pizza has {{toppings()}}!</h4>\n  <ion-toggle ng-model=\"pizza.pepperoni\">\n    Pepperoni?\n  </ion-toggle>\n  <ion-toggle ng-model=\"pizza.sausage\" toggle-class=\"toggle-energized\">\n    Sausage?\n  </ion-toggle>\n  <ion-toggle ng-model=\"pizza.jalapenos\" toggle-class=\"toggle-calm\">\n    Jalapeno?\n  </ion-toggle>\n  <ion-toggle ng-model=\"pizza.anchovies\" toggle-class=\"toggle-royal\">\n    Anchovies?\n  </ion-toggle>\n</ion-content>\n"
      }
    ],
    "js": [
      {
        "name": "simple",
        "component": "ionToggle",
        "id": "ionToggle-simple",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\n\nvar app = angular.module('simple', ['ionic']);\napp.controller('MainCtrl', function($scope) {\n  $scope.pizza = {\n    pepperoni: true,\n    sausage: false,\n    anchovies: true,\n    jalapenos: false\n  };\n\n  $scope.toppings = function() {\n    var toppings = Object.keys($scope.pizza).filter(function(flavor) {\n      return $scope.pizza[flavor];\n    });\n    if (toppings.length > 1) {\n      toppings[toppings.length - 1] = 'and ' + toppings[toppings.length - 1];\n    }\n    if (toppings.length > 2) {\n      return toppings.join(', ');\n    } else if (toppings.length) {\n      return toppings.join(' ');\n    } else {\n      return 'nothing';\n    }\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionToggle/simple/index.js",
        "renderedContent": "\n\nvar app = angular.module('simple', ['ionic']);\napp.controller('MainCtrl', function($scope) {\n  $scope.pizza = {\n    pepperoni: true,\n    sausage: false,\n    anchovies: true,\n    jalapenos: false\n  };\n\n  $scope.toppings = function() {\n    var toppings = Object.keys($scope.pizza).filter(function(flavor) {\n      return $scope.pizza[flavor];\n    });\n    if (toppings.length > 1) {\n      toppings[toppings.length - 1] = 'and ' + toppings[toppings.length - 1];\n    }\n    if (toppings.length > 2) {\n      return toppings.join(', ');\n    } else if (toppings.length) {\n      return toppings.join(' ');\n    } else {\n      return 'nothing';\n    }\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "simple",
        "component": "ionToggle",
        "id": "ionToggle-simple",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should uncheck 1st and check 2nd checkbox by clicking its label', function(){\n  var ele = element.all(by.css('label.toggle'));\n  ele.get(0).click();\n  ele.get(1).click();\n});\n\nit('should check 1st and uncheck 2nd checkbox by clicking its label', function(){\n  var ele = element.all(by.css('label.toggle'));\n  ele.get(0).click();\n  ele.get(1).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionToggle/simple/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionToggle/simple/",
        "renderedContent": "describe('ionToggle-simple', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionToggle/simple/');\n});\n\n\n\nit('should uncheck 1st and check 2nd checkbox by clicking its label', function(){\n  var ele = element.all(by.css('label.toggle'));\n  ele.get(0).click();\n  ele.get(1).click();\n});\n\nit('should check 1st and uncheck 2nd checkbox by clicking its label', function(){\n  var ele = element.all(by.css('label.toggle'));\n  ele.get(0).click();\n  ele.get(1).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "ionToggle-simple",
  "name": "simple",
  "component": "ionToggle",
  "href": "/nightly/ionToggle/simple/"
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

