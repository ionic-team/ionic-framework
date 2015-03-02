var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "chooseOne",
        "component": "ionRadio",
        "id": "ionRadio-chooseOne",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Radios</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"ChooseOneCtrl\">\n  <h1>\n    Your Choice: <span class=\"assertive\">{{choice}}</span> \n  </h1>\n  <ion-radio ng-model=\"choice\" value=\"one\">One</ion-radio>\n  <ion-radio ng-model=\"choice\" value=\"two\">Two</ion-radio>\n  <ion-radio ng-model=\"choice\" ng-value=\"'three'\">Three</ion-radio>\n  <ion-radio ng-model=\"choice\" ng-value=\"'four'\">Four</ion-radio>\n  <ion-radio ng-model=\"choice\" value=\"five\">Five</ion-radio>\n</ion-content>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionRadio/chooseOne/index.html",
        "renderedContent": "\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Radios</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"ChooseOneCtrl\">\n  <h1>\n    Your Choice: <span class=\"assertive\">{{choice}}</span> \n  </h1>\n  <ion-radio ng-model=\"choice\" value=\"one\">One</ion-radio>\n  <ion-radio ng-model=\"choice\" value=\"two\">Two</ion-radio>\n  <ion-radio ng-model=\"choice\" ng-value=\"'three'\">Three</ion-radio>\n  <ion-radio ng-model=\"choice\" ng-value=\"'four'\">Four</ion-radio>\n  <ion-radio ng-model=\"choice\" value=\"five\">Five</ion-radio>\n</ion-content>\n"
      }
    ],
    "js": [
      {
        "name": "chooseOne",
        "component": "ionRadio",
        "id": "ionRadio-chooseOne",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('chooseOne', ['ionic'])\n.controller('ChooseOneCtrl', function($scope) {\n  $scope.choice = 'two';\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionRadio/chooseOne/index.js",
        "renderedContent": "\nangular.module('chooseOne', ['ionic'])\n.controller('ChooseOneCtrl', function($scope) {\n  $scope.choice = 'two';\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "chooseOne",
        "component": "ionRadio",
        "id": "ionRadio-chooseOne",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should check 3rd radio by clicking its label', function(){\n  var ele = element.all(by.css('label.item-radio'));\n  ele.get(2).click();\n});\n\nit('should check 4th radio by clicking its label', function(){\n  var ele = element.all(by.css('label.item-radio'));\n  ele.get(3).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionRadio/chooseOne/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionRadio/chooseOne/",
        "renderedContent": "describe('ionRadio-chooseOne', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionRadio/chooseOne/');\n});\n\n\n\nit('should check 3rd radio by clicking its label', function(){\n  var ele = element.all(by.css('label.item-radio'));\n  ele.get(2).click();\n});\n\nit('should check 4th radio by clicking its label', function(){\n  var ele = element.all(by.css('label.item-radio'));\n  ele.get(3).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "ionRadio-chooseOne",
  "name": "chooseOne",
  "component": "ionRadio",
  "href": "/nightly/ionRadio/chooseOne/"
};


angular.module('chooseOne'
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
      .val(['<html ng-app="chooseOne">',
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

