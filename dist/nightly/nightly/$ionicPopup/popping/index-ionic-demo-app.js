var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "popping",
        "component": "$ionicPopup",
        "id": "$ionicPopup-popping",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Popups</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"PopupCtrl\">\n  <button class=\"button button-dark\" ng-click=\"showPopup()\">Generic</button>\n  <button class=\"button button-primary\" ng-click=\"showConfirm()\">Confirm</button>\n  <button class=\"button button-balanced\" ng-click=\"showPrompt()\">Prompt</button>\n  <button class=\"button button-balanced\" ng-click=\"showPasswordPrompt()\">Password Prompt</button>\n  <button class=\"button button-positive\" ng-click=\"showAlert()\">Alert</button>\n  <div class=\"list\">\n    <a class=\"item\" href=\"#\"\n      ng-repeat=\"item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\">\n      Item {{item}}\n    </a>\n  </div>\n</ion-content>\n\n<script id=\"popup-template.html\" type=\"text/ng-template\">\n  <input ng-model=\"data.wifi\" type=\"text\" placeholder=\"Password\">\n</script>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/$ionicPopup/popping/index.html",
        "renderedContent": "\n\n<ion-header-bar class=\"bar-positive\">\n  <h1 class=\"title\">Popups</h1>\n</ion-header-bar>\n<ion-content ng-controller=\"PopupCtrl\">\n  <button class=\"button button-dark\" ng-click=\"showPopup()\">Generic</button>\n  <button class=\"button button-primary\" ng-click=\"showConfirm()\">Confirm</button>\n  <button class=\"button button-balanced\" ng-click=\"showPrompt()\">Prompt</button>\n  <button class=\"button button-balanced\" ng-click=\"showPasswordPrompt()\">Password Prompt</button>\n  <button class=\"button button-positive\" ng-click=\"showAlert()\">Alert</button>\n  <div class=\"list\">\n    <a class=\"item\" href=\"#\"\n      ng-repeat=\"item in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\">\n      Item {{item}}\n    </a>\n  </div>\n</ion-content>\n\n<script id=\"popup-template.html\" type=\"text/ng-template\">\n  <input ng-model=\"data.wifi\" type=\"text\" placeholder=\"Password\">\n</script>\n"
      }
    ],
    "js": [
      {
        "name": "popping",
        "component": "$ionicPopup",
        "id": "$ionicPopup-popping",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('popping', ['ionic'])\n.controller('PopupCtrl', function($scope, $timeout, $q, $ionicPopup) {\n  $scope.showPopup = function() {\n    $scope.data = {}\n\n    $ionicPopup.show({\n      templateUrl: 'popup-template.html',\n      title: 'Enter Wi-Fi Password',\n      subTitle: 'Please use normal things',\n      scope: $scope,\n      buttons: [\n        { text: 'Cancel', onTap: function(e) { return true; } },\n        {\n          text: '<b>Save</b>',\n          type: 'button-positive',\n          onTap: function(e) {\n            return $scope.data.wifi;\n          }\n        },\n      ]\n      }).then(function(res) {\n        console.log('Tapped!', res);\n      }, function(err) {\n        console.log('Err:', err);\n      }, function(msg) {\n        console.log('message:', msg);\n      });\n\n    $timeout(function() {\n      $ionicPopup.confirm({\n        title: 'Do you like ice cream?',\n        cancelText: 'No',\n        okText: 'Yes, of course'\n      }).then(function(res) {\n        console.log('Your love for ice cream:', res);\n      });\n    }, 1000);\n  };\n\n  $scope.showConfirm = function() {\n    $ionicPopup.confirm({\n      title: 'Consume Ice Cream',\n      content: 'Are you sure you want to eat this ice cream?'\n    }).then(function(res) {\n      if(res) {\n        console.log('You are sure');\n      } else {\n        console.log('You are not sure');\n      }\n    });\n  };\n  $scope.showPrompt = function() {\n    $ionicPopup.prompt({\n      title: 'ID Check',\n      subTitle: 'What is your name?'\n    }).then(function(res) {\n      console.log('Your name is', res);\n    });\n  };\n  $scope.showPasswordPrompt = function() {\n    $ionicPopup.prompt({\n      title: 'Password Check',\n      subTitle: 'Enter your secret password',\n      inputType: 'password',\n      inputPlaceholder: 'Your password'\n    }).then(function(res) {\n      console.log('Your name is', res);\n    });\n  };\n  $scope.showAlert = function() {\n    $ionicPopup.alert({\n      title: 'Draft Saved',\n      content: 'Your Data has been saved!'\n    }).then(function(res) {\n      console.log('Your Data has been saved!');\n    }, function(err) {},\n    function(popup) {\n      console.log('Got popup', popup);\n      $timeout(function() {\n        popup.close();\n      }, 1000);\n    });\n  };\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/$ionicPopup/popping/index.js",
        "renderedContent": "\nangular.module('popping', ['ionic'])\n.controller('PopupCtrl', function($scope, $timeout, $q, $ionicPopup) {\n  $scope.showPopup = function() {\n    $scope.data = {}\n\n    $ionicPopup.show({\n      templateUrl: 'popup-template.html',\n      title: 'Enter Wi-Fi Password',\n      subTitle: 'Please use normal things',\n      scope: $scope,\n      buttons: [\n        { text: 'Cancel', onTap: function(e) { return true; } },\n        {\n          text: '<b>Save</b>',\n          type: 'button-positive',\n          onTap: function(e) {\n            return $scope.data.wifi;\n          }\n        },\n      ]\n      }).then(function(res) {\n        console.log('Tapped!', res);\n      }, function(err) {\n        console.log('Err:', err);\n      }, function(msg) {\n        console.log('message:', msg);\n      });\n\n    $timeout(function() {\n      $ionicPopup.confirm({\n        title: 'Do you like ice cream?',\n        cancelText: 'No',\n        okText: 'Yes, of course'\n      }).then(function(res) {\n        console.log('Your love for ice cream:', res);\n      });\n    }, 1000);\n  };\n\n  $scope.showConfirm = function() {\n    $ionicPopup.confirm({\n      title: 'Consume Ice Cream',\n      content: 'Are you sure you want to eat this ice cream?'\n    }).then(function(res) {\n      if(res) {\n        console.log('You are sure');\n      } else {\n        console.log('You are not sure');\n      }\n    });\n  };\n  $scope.showPrompt = function() {\n    $ionicPopup.prompt({\n      title: 'ID Check',\n      subTitle: 'What is your name?'\n    }).then(function(res) {\n      console.log('Your name is', res);\n    });\n  };\n  $scope.showPasswordPrompt = function() {\n    $ionicPopup.prompt({\n      title: 'Password Check',\n      subTitle: 'Enter your secret password',\n      inputType: 'password',\n      inputPlaceholder: 'Your password'\n    }).then(function(res) {\n      console.log('Your name is', res);\n    });\n  };\n  $scope.showAlert = function() {\n    $ionicPopup.alert({\n      title: 'Draft Saved',\n      content: 'Your Data has been saved!'\n    }).then(function(res) {\n      console.log('Your Data has been saved!');\n    }, function(err) {},\n    function(popup) {\n      console.log('Got popup', popup);\n      $timeout(function() {\n        popup.close();\n      }, 1000);\n    });\n  };\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "popping",
        "component": "$ionicPopup",
        "id": "$ionicPopup-popping",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should open confirm popup', function(){\n  var ele = element.all(by.css('[ng-click=\"showConfirm()\"]'));\n  ele.get(0).click();\n});\n\nit('should cancel confirm popup', function(){\n  var ele = element.all(by.css('.popup-buttons .button'));\n  ele.get(0).click();\n});\n\nit('should open prompt popup and enter input', function(){\n  var ele = element.all(by.css('[ng-click=\"showPrompt()\"]'));\n  ele.get(0).click();\n  ele = element(by.model('data.response'));\n  ele.sendKeys('Waffles');\n});\n\nit('should close prompt popup by clicking OK', function(){\n  var ele = element.all(by.css('.popup-buttons .button'));\n  ele.get(1).click();\n});\n\nit('should open alert popup', function(){\n  var ele = element.all(by.css('[ng-click=\"showAlert()\"]'));\n  ele.get(0).click();\n});\n\nit('should close alert popup', function(){\n  var ele = element.all(by.css('.popup-buttons .button'));\n  ele.get(0).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/$ionicPopup/popping/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/$ionicPopup/popping/",
        "renderedContent": "describe('$ionicPopup-popping', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/$ionicPopup/popping/');\n});\n\n\n\nit('should open confirm popup', function(){\n  var ele = element.all(by.css('[ng-click=\"showConfirm()\"]'));\n  ele.get(0).click();\n});\n\nit('should cancel confirm popup', function(){\n  var ele = element.all(by.css('.popup-buttons .button'));\n  ele.get(0).click();\n});\n\nit('should open prompt popup and enter input', function(){\n  var ele = element.all(by.css('[ng-click=\"showPrompt()\"]'));\n  ele.get(0).click();\n  ele = element(by.model('data.response'));\n  ele.sendKeys('Waffles');\n});\n\nit('should close prompt popup by clicking OK', function(){\n  var ele = element.all(by.css('.popup-buttons .button'));\n  ele.get(1).click();\n});\n\nit('should open alert popup', function(){\n  var ele = element.all(by.css('[ng-click=\"showAlert()\"]'));\n  ele.get(0).click();\n});\n\nit('should close alert popup', function(){\n  var ele = element.all(by.css('.popup-buttons .button'));\n  ele.get(0).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "$ionicPopup-popping",
  "name": "popping",
  "component": "$ionicPopup",
  "href": "/nightly/$ionicPopup/popping/"
};


angular.module('popping'
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
      .val(['<html ng-app="popping">',
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

