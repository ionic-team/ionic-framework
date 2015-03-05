var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "floatingLabel",
        "component": "itemFloatingLabel",
        "id": "itemFloatingLabel-floatingLabel",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">\n    Text Input: Floating Label\n  </h1>\n</ion-header-bar>\n\n<ion-content ng-controller=\"AppCtrl\">\n\n  <div class=\"list\">\n    <label class=\"item item-input item-floating-label\">\n      <span class=\"input-label\">Name</span>\n      <input type=\"text\" placeholder=\"Name\">\n    </label>\n    <label class=\"item item-input item-floating-label\">\n      <span class=\"input-label\">Profession</span>\n      <input type=\"text\" placeholder=\"Profession\">\n    </label>\n    <label class=\"item item-input item-floating-label\">\n      <span class=\"input-label\">Favorite Song</span>\n      <textarea placeholder=\"Favorite Song\" ng-model=\"favSong\"></textarea>\n    </label>\n  </div>\n\n</ion-content>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/itemFloatingLabel/floatingLabel/index.html",
        "renderedContent": "\n\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">\n    Text Input: Floating Label\n  </h1>\n</ion-header-bar>\n\n<ion-content ng-controller=\"AppCtrl\">\n\n  <div class=\"list\">\n    <label class=\"item item-input item-floating-label\">\n      <span class=\"input-label\">Name</span>\n      <input type=\"text\" placeholder=\"Name\">\n    </label>\n    <label class=\"item item-input item-floating-label\">\n      <span class=\"input-label\">Profession</span>\n      <input type=\"text\" placeholder=\"Profession\">\n    </label>\n    <label class=\"item item-input item-floating-label\">\n      <span class=\"input-label\">Favorite Song</span>\n      <textarea placeholder=\"Favorite Song\" ng-model=\"favSong\"></textarea>\n    </label>\n  </div>\n\n</ion-content>\n"
      }
    ],
    "js": [
      {
        "name": "floatingLabel",
        "component": "itemFloatingLabel",
        "id": "itemFloatingLabel-floatingLabel",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\n\nvar app = angular.module('floatingLabel', ['ionic']);\n\napp.controller('AppCtrl', function($scope) {\n\n  $scope.favSong = \"Tubthumping\";\n\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/itemFloatingLabel/floatingLabel/index.js",
        "renderedContent": "\n\nvar app = angular.module('floatingLabel', ['ionic']);\n\napp.controller('AppCtrl', function($scope) {\n\n  $scope.favSong = \"Tubthumping\";\n\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "floatingLabel",
        "component": "itemFloatingLabel",
        "id": "itemFloatingLabel-floatingLabel",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should enter text into floating label inputs', function(){\n  var ele = element.all(by.css('label.item-floating-label input, label.item-floating-label textarea'));\n  ele.get(0).sendKeys('Dr. Pumpernickel');\n  ele.get(1).sendKeys('Round House Kicks');\n});\n\nit('should add and remove text from floating label inputs', function(){\n  var ele = element.all(by.css('label.item-floating-label input, label.item-floating-label textarea'));\n\n  for(var x=0; x<'Dr. Pumpernickel'.length; x++) {\n    ele.get(0).sendKeys(protractor.Key.BACK_SPACE);\n  }\n\n  ele.get(1).sendKeys(\" To The Face\");\n\n  for(var x=0; x<'Tubthumping'.length; x++) {\n    ele.get(2).sendKeys(protractor.Key.BACK_SPACE);\n  }\n\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/itemFloatingLabel/floatingLabel/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/itemFloatingLabel/floatingLabel/",
        "renderedContent": "describe('itemFloatingLabel-floatingLabel', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/itemFloatingLabel/floatingLabel/');\n});\n\n\n\nit('should enter text into floating label inputs', function(){\n  var ele = element.all(by.css('label.item-floating-label input, label.item-floating-label textarea'));\n  ele.get(0).sendKeys('Dr. Pumpernickel');\n  ele.get(1).sendKeys('Round House Kicks');\n});\n\nit('should add and remove text from floating label inputs', function(){\n  var ele = element.all(by.css('label.item-floating-label input, label.item-floating-label textarea'));\n\n  for(var x=0; x<'Dr. Pumpernickel'.length; x++) {\n    ele.get(0).sendKeys(protractor.Key.BACK_SPACE);\n  }\n\n  ele.get(1).sendKeys(\" To The Face\");\n\n  for(var x=0; x<'Tubthumping'.length; x++) {\n    ele.get(2).sendKeys(protractor.Key.BACK_SPACE);\n  }\n\n});\n\n});\n"
      }
    ]
  },
  "id": "itemFloatingLabel-floatingLabel",
  "name": "floatingLabel",
  "component": "itemFloatingLabel",
  "href": "/nightly/itemFloatingLabel/floatingLabel/"
};


angular.module('floatingLabel'
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
      .val(['<html ng-app="floatingLabel">',
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

