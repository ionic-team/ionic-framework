var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "navWithMenu",
        "component": "ionSideMenus",
        "id": "ionSideMenus-navWithMenu",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-nav-view>\n</ion-nav-view>\n\n<script type=\"text/ng-template\" id=\"templates/menu.html\">\n  <ion-side-menus>\n\n    <ion-pane ion-side-menu-content>\n      <ion-nav-bar class=\"bar-stable nav-title-slide-ios7\">\n        <ion-nav-back-button class=\"button-clear\"><i class=\"icon ion-chevron-left\"></i> Back</ion-nav-back-button>\n      </ion-nav-bar>\n      <ion-nav-view name=\"menuContent\" animation=\"slide-left-right\"></ion-nav-view>\n    </ion-pane>\n\n    <ion-side-menu side=\"left\">\n      <header class=\"bar bar-header bar-stable\">\n        <h1 class=\"title\">Left</h1>\n      </header>\n      <ion-content class=\"has-header\" scroll=\"false\">\n        <ion-list>\n          <ion-item nav-clear menu-close href=\"#/app/search\">\n            Search\n          </ion-item>\n          <ion-item nav-clear menu-close href=\"#/app/browse\">\n            Browse\n          </ion-item>\n          <ion-item nav-clear menu-close href=\"#/app/playlists\">\n            Playlists\n          </ion-item>\n        </ion-list>\n      </ion-content>\n    </ion-side-menu>\n\n  </ion-side-menus>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/browse.html\">\n  <ion-view title=\"Browse\">\n    <ion-nav-buttons side=\"left\">\n      <button menu-toggle=\"left\"class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n      <h1>Browse</h1>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/playlist.html\">\n  <ion-view title=\"Playlist\">\n    <ion-content class=\"has-header\">\n      <h1>Playlist</h1>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/playlists.html\">\n  <ion-view title=\"Playlists\">\n    <ion-nav-buttons side=\"left\">\n      <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n      <ion-list>\n        <ion-item ng-repeat=\"playlist in playlists\" href=\"#/app/playlists/{{playlist.id}}\">\n          {{playlist.title}}\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/search.html\">\n  <ion-view title=\"Search\">\n    <ion-nav-buttons side=\"left\">\n      <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n      <h1>Search</h1>\n    </ion-content>\n  </ion-view>\n</script>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSideMenus/navWithMenu/index.html",
        "renderedContent": "\n<ion-nav-view>\n</ion-nav-view>\n\n<script type=\"text/ng-template\" id=\"templates/menu.html\">\n  <ion-side-menus>\n\n    <ion-pane ion-side-menu-content>\n      <ion-nav-bar class=\"bar-stable nav-title-slide-ios7\">\n        <ion-nav-back-button class=\"button-clear\"><i class=\"icon ion-chevron-left\"></i> Back</ion-nav-back-button>\n      </ion-nav-bar>\n      <ion-nav-view name=\"menuContent\" animation=\"slide-left-right\"></ion-nav-view>\n    </ion-pane>\n\n    <ion-side-menu side=\"left\">\n      <header class=\"bar bar-header bar-stable\">\n        <h1 class=\"title\">Left</h1>\n      </header>\n      <ion-content class=\"has-header\" scroll=\"false\">\n        <ion-list>\n          <ion-item nav-clear menu-close href=\"#/app/search\">\n            Search\n          </ion-item>\n          <ion-item nav-clear menu-close href=\"#/app/browse\">\n            Browse\n          </ion-item>\n          <ion-item nav-clear menu-close href=\"#/app/playlists\">\n            Playlists\n          </ion-item>\n        </ion-list>\n      </ion-content>\n    </ion-side-menu>\n\n  </ion-side-menus>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/browse.html\">\n  <ion-view title=\"Browse\">\n    <ion-nav-buttons side=\"left\">\n      <button menu-toggle=\"left\"class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n      <h1>Browse</h1>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/playlist.html\">\n  <ion-view title=\"Playlist\">\n    <ion-content class=\"has-header\">\n      <h1>Playlist</h1>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/playlists.html\">\n  <ion-view title=\"Playlists\">\n    <ion-nav-buttons side=\"left\">\n      <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n      <ion-list>\n        <ion-item ng-repeat=\"playlist in playlists\" href=\"#/app/playlists/{{playlist.id}}\">\n          {{playlist.title}}\n        </ion-item>\n      </ion-list>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script type=\"text/ng-template\" id=\"templates/search.html\">\n  <ion-view title=\"Search\">\n    <ion-nav-buttons side=\"left\">\n      <button menu-toggle=\"left\" class=\"button button-icon icon ion-navicon\"></button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n      <h1>Search</h1>\n    </ion-content>\n  </ion-view>\n</script>\n"
      }
    ],
    "js": [
      {
        "name": "navWithMenu",
        "component": "ionSideMenus",
        "id": "ionSideMenus-navWithMenu",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('navWithMenu', ['ionic'])\n.config(function($stateProvider, $urlRouterProvider) {\n  $stateProvider\n\n    .state('app', {\n      url: \"/app\",\n      abstract: true,\n      templateUrl: \"templates/menu.html\",\n      controller: 'AppCtrl'\n    })\n\n    .state('app.search', {\n      url: \"/search\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/search.html\"\n        }\n      }\n    })\n\n    .state('app.browse', {\n      url: \"/browse\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/browse.html\"\n        }\n      }\n    })\n    .state('app.playlists', {\n      url: \"/playlists\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/playlists.html\",\n          controller: 'PlaylistsCtrl'\n        }\n      }\n    })\n\n    .state('app.single', {\n      url: \"/playlists/:playlistId\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/playlist.html\",\n          controller: 'PlaylistCtrl'\n        }\n      }\n    });\n  // if none of the above states are matched, use this as the fallback\n  $urlRouterProvider.otherwise('/app/playlists');\n})\n\n.controller('AppCtrl', function($scope) {\n})\n\n.controller('PlaylistsCtrl', function($scope) {\n  $scope.playlists = [\n    { title: 'Reggae', id: 1 },\n    { title: 'Chill', id: 2 },\n    { title: 'Dubstep', id: 3 },\n    { title: 'Indie', id: 4 },\n    { title: 'Rap', id: 5 },\n    { title: 'Cowbell', id: 6 }\n  ];\n})\n\n.controller('PlaylistCtrl', function($scope, $stateParams) {\n})",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionSideMenus/navWithMenu/index.js",
        "renderedContent": "\nangular.module('navWithMenu', ['ionic'])\n.config(function($stateProvider, $urlRouterProvider) {\n  $stateProvider\n\n    .state('app', {\n      url: \"/app\",\n      abstract: true,\n      templateUrl: \"templates/menu.html\",\n      controller: 'AppCtrl'\n    })\n\n    .state('app.search', {\n      url: \"/search\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/search.html\"\n        }\n      }\n    })\n\n    .state('app.browse', {\n      url: \"/browse\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/browse.html\"\n        }\n      }\n    })\n    .state('app.playlists', {\n      url: \"/playlists\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/playlists.html\",\n          controller: 'PlaylistsCtrl'\n        }\n      }\n    })\n\n    .state('app.single', {\n      url: \"/playlists/:playlistId\",\n      views: {\n        'menuContent' :{\n          templateUrl: \"templates/playlist.html\",\n          controller: 'PlaylistCtrl'\n        }\n      }\n    });\n  // if none of the above states are matched, use this as the fallback\n  $urlRouterProvider.otherwise('/app/playlists');\n})\n\n.controller('AppCtrl', function($scope) {\n})\n\n.controller('PlaylistsCtrl', function($scope) {\n  $scope.playlists = [\n    { title: 'Reggae', id: 1 },\n    { title: 'Chill', id: 2 },\n    { title: 'Dubstep', id: 3 },\n    { title: 'Indie', id: 4 },\n    { title: 'Rap', id: 5 },\n    { title: 'Cowbell', id: 6 }\n  ];\n})\n\n.controller('PlaylistCtrl', function($scope, $stateParams) {\n})\n"
      }
    ],
    "scenario.js": [
      {
        "name": "navWithMenu",
        "component": "ionSideMenus",
        "id": "ionSideMenus-navWithMenu",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\n\nit('should nav to Search from left menu', function(){\n  var ele = element.all(by.css('button[menu-toggle=\"left\"]'));\n  ele.get(0).click();\n\n  browser.sleep(500).then(function(){\n    var itemEle = element.all(by.css('ion-side-menu[side=\"left\"] a'));\n    itemEle.get(0).click();\n  });\n});\n\nit('should nav to Browse from left menu', function(){\n  var ele = element.all(by.css('button[menu-toggle=\"left\"]'));\n  ele.get(0).click();\n\n  browser.sleep(500).then(function(){\n    var itemEle = element.all(by.css('ion-side-menu[side=\"left\"] a'));\n    itemEle.get(1).click();\n  });\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionSideMenus/navWithMenu/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionSideMenus/navWithMenu/",
        "renderedContent": "describe('ionSideMenus-navWithMenu', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionSideMenus/navWithMenu/');\n});\n\n\n\nit('should nav to Search from left menu', function(){\n  var ele = element.all(by.css('button[menu-toggle=\"left\"]'));\n  ele.get(0).click();\n\n  browser.sleep(500).then(function(){\n    var itemEle = element.all(by.css('ion-side-menu[side=\"left\"] a'));\n    itemEle.get(0).click();\n  });\n});\n\nit('should nav to Browse from left menu', function(){\n  var ele = element.all(by.css('button[menu-toggle=\"left\"]'));\n  ele.get(0).click();\n\n  browser.sleep(500).then(function(){\n    var itemEle = element.all(by.css('ion-side-menu[side=\"left\"] a'));\n    itemEle.get(1).click();\n  });\n});\n\n});\n"
      }
    ]
  },
  "id": "ionSideMenus-navWithMenu",
  "name": "navWithMenu",
  "component": "ionSideMenus",
  "href": "/nightly/ionSideMenus/navWithMenu/"
};


angular.module('navWithMenu'
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
      .val(['<html ng-app="navWithMenu">',
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

