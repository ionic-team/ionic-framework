var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "simple",
        "component": "ionFooterBar",
        "id": "ionFooterBar-simple",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<div ng-controller=\"FooterBarSimpleCtrl\">\n  <ion-footer-bar class=\"bar-assertive\"\n      ng-class=\"{'bar-subfooter': data.isSubfooter}\"\n      ng-show=\"data.isShown\">\n    <h1 class=\"title\">Footer</h1>\n  </ion-footer-bar>\n  <ion-content>\n    <ion-toggle ng-model=\"data.isSubfooter\">\n      Make it a Subfooter?\n    </ion-toggle>\n    <ion-toggle ng-model=\"data.isShown\">\n      Show it?\n    </ion-toggle>\n    <div class=\"list\">\n      <div class=\"item\" ng-repeat=\"item in items\">\n        {{item}}\n      </div>\n    </div>\n  </ion-content>\n</div>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionFooterBar/simple/index.html",
        "renderedContent": "\n<div ng-controller=\"FooterBarSimpleCtrl\">\n  <ion-footer-bar class=\"bar-assertive\"\n      ng-class=\"{'bar-subfooter': data.isSubfooter}\"\n      ng-show=\"data.isShown\">\n    <h1 class=\"title\">Footer</h1>\n  </ion-footer-bar>\n  <ion-content>\n    <ion-toggle ng-model=\"data.isSubfooter\">\n      Make it a Subfooter?\n    </ion-toggle>\n    <ion-toggle ng-model=\"data.isShown\">\n      Show it?\n    </ion-toggle>\n    <div class=\"list\">\n      <div class=\"item\" ng-repeat=\"item in items\">\n        {{item}}\n      </div>\n    </div>\n  </ion-content>\n</div>\n"
      }
    ],
    "js": [
      {
        "name": "simple",
        "component": "ionFooterBar",
        "id": "ionFooterBar-simple",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('simple', ['ionic'])\n.controller('FooterBarSimpleCtrl', function($scope) {\n  $scope.data = {\n    isSubfooter: false,\n    isShown: true\n  };\n\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push('Item ' + i);\n  }\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionFooterBar/simple/index.js",
        "renderedContent": "\nangular.module('simple', ['ionic'])\n.controller('FooterBarSimpleCtrl', function($scope) {\n  $scope.data = {\n    isSubfooter: false,\n    isShown: true\n  };\n\n  $scope.items = [];\n  for (var i = 0; i < 20; i++) {\n    $scope.items.push('Item ' + i);\n  }\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "simple",
        "component": "ionFooterBar",
        "id": "ionFooterBar-simple",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should show subfooter', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(0).click();\n});\n\nit('should hide subfooter', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(0).click();\n});\n\nit('should hide footer', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(1).click();\n});\n\nit('should show footer', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(1).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionFooterBar/simple/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionFooterBar/simple/",
        "renderedContent": "describe('ionFooterBar-simple', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionFooterBar/simple/');\n});\n\n\n\nit('should show subfooter', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(0).click();\n});\n\nit('should hide subfooter', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(0).click();\n});\n\nit('should hide footer', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(1).click();\n});\n\nit('should show footer', function(){\n  var ele = element.all(by.css('.toggle'));\n  ele.get(1).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "ionFooterBar-simple",
  "name": "simple",
  "component": "ionFooterBar",
  "href": "/nightly/ionFooterBar/simple/"
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

