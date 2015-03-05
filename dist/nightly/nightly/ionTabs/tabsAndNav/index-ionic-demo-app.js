var DEMO;

  DEMO = {
  "files": {
    "html": [
      {
        "name": "tabsAndNav",
        "component": "ionTabs",
        "id": "ionTabs-tabsAndNav",
        "fileType": ".html",
        "fileName": "index.html",
        "contents": "\n<ion-nav-bar class=\"nav-title-slide-ios7 bar-positive\">\n  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n  </ion-nav-back-button>\n</ion-nav-bar>\n\n<ion-nav-view animation=\"slide-left-right\"></ion-nav-view>\n\n<script id=\"tabs.html\" type=\"text/ng-template\">\n  <ion-tabs class=\"tabs-icon-top tabs-positive\">\n\n    <ion-tab title=\"Home\" icon=\"ion-home\" href=\"#/tab/home\">\n      <ion-nav-view name=\"home-tab\"></ion-nav-view>\n    </ion-tab>\n\n    <ion-tab title=\"About\" icon=\"ion-ios7-information\" href=\"#/tab/about\">\n      <ion-nav-view name=\"about-tab\"></ion-nav-view>\n    </ion-tab>\n\n    <ion-tab title=\"Contact\" icon=\"ion-ios7-world\" ui-sref=\"tabs.contact\">\n      <ion-nav-view name=\"contact-tab\"></ion-nav-view>\n    </ion-tab>\n\n  </ion-tabs>\n</script>\n\n<script id=\"home.html\" type=\"text/ng-template\">\n  <ion-view title=\"Home\">\n    <ion-content class=\"padding\">\n      <p>Example of Ionic tabs. Navigate to each tab, and\n      navigate to child views of each tab and notice how\n      each tab has its own navigation history.</p>\n      <p>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts\">Scientific Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"facts.html\" type=\"text/ng-template\">\n  <ion-view title=\"Facts\" class=\"padding\">\n    <ion-content>\n      <p>Banging your head against a wall uses 150 calories an hour.</p>\n      <p>Dogs have four toes on their hind feet, and five on their front feet.</p>\n      <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>\n      <p>A cockroach will live nine days without it's head, before it starves to death.</p>\n      <p>Polar bears are left handed.</p>\n      <p>\n        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts2\">More Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"facts2.html\" type=\"text/ng-template\">\n  <ion-view title=\"Also Factual\">\n    <ion-content class=\"padding\">\n      <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>\n      <p>1 in every 4 Americans has appeared on T.V.</p>\n      <p>11% of the world is left-handed.</p>\n      <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>\n      <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>\n      <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>\n      <p>\n        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n        <a class=\"button icon ion-chevron-left\" href=\"#/tab/facts\"> Scientific Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"about.html\" type=\"text/ng-template\">\n  <ion-view title=\"About\">\n    <ion-content class=\"padding\">\n      <h3>Create hybrid mobile apps with the web technologies you love.</h3>\n      <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>\n      <p>Built with Sass and optimized for AngularJS.</p>\n      <p>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/navstack\">Tabs Nav Stack</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"nav-stack.html\" type=\"text/ng-template\">\n  <ion-view title=\"Tab Nav Stack\">\n    <ion-content class=\"padding\">\n\n      <p>Almost every mobile application has some form of tab bar interface.</p>\n\n      <p>Ionic has a built-in <code>ion-tabs</code> directive that we can use in order to build our tabbed interface. Create the <code>ion-tabs</code> directive and we can start filling it with tabs. The directive to create a tab is just the <code>ion-tab</code> directive. This takes a title, and this specifies what the title of our tab will be. </p>\n\n      <p>When we save this, we now have a tab that pops up with the text of “Home tab”.</p>\n\n      <p>Let’s add a second tab, because a single-tabbed app is pretty boring. I’m just going to call this one “About”. I’m going to create some equally interesting content.</p>\n\n      <p>We can now swap between our tabs, and see that things happen! We may want to change the color scheme of our tabs. Ionic ships with several colors that are detailed in the documentation in the notes, but if we want to update that, we can set a class of <code>ion-tabs</code>.</p>\n\n      <p>Now, if we look in the documentation, the colors are unprefixed. If we want the blue color, we use the <code>positive</code> class. However, in the case of tabs, we want those to be able to be sub-customizable. For this, we have to prefix this class with ‘tabs-‘. Saving, we now see the nice color.</p>\n\n      <p>Let’s add a header. This can be added with the <code>ion-header-bar</code> directive. Inside, we can set what we want the title to be. Let’s set a color on it. This is interesting, but what if we want a different title for each section of the application?</p>\n\n      <p>You can set a navigation system up, which is detailed in more advanced videos and formulas. For the sake of simplicity in this video, we will create an <code>ion-header-bar</code> in each tab of our app. Copy the header bar, change the titles, and save. We now have updating headers across our tabs!</p>\n\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"contact.html\" type=\"text/ng-template\">\n  <ion-view title=\"Contact\">\n    <ion-content>\n      <p>@IonicFramework</p>\n      <p>@DriftyCo</p>\n    </ion-content>\n  </ion-view>\n</script>",
        "extension": "html",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionTabs/tabsAndNav/index.html",
        "renderedContent": "\n<ion-nav-bar class=\"nav-title-slide-ios7 bar-positive\">\n  <ion-nav-back-button class=\"button-icon ion-arrow-left-c\">\n  </ion-nav-back-button>\n</ion-nav-bar>\n\n<ion-nav-view animation=\"slide-left-right\"></ion-nav-view>\n\n<script id=\"tabs.html\" type=\"text/ng-template\">\n  <ion-tabs class=\"tabs-icon-top tabs-positive\">\n\n    <ion-tab title=\"Home\" icon=\"ion-home\" href=\"#/tab/home\">\n      <ion-nav-view name=\"home-tab\"></ion-nav-view>\n    </ion-tab>\n\n    <ion-tab title=\"About\" icon=\"ion-ios7-information\" href=\"#/tab/about\">\n      <ion-nav-view name=\"about-tab\"></ion-nav-view>\n    </ion-tab>\n\n    <ion-tab title=\"Contact\" icon=\"ion-ios7-world\" ui-sref=\"tabs.contact\">\n      <ion-nav-view name=\"contact-tab\"></ion-nav-view>\n    </ion-tab>\n\n  </ion-tabs>\n</script>\n\n<script id=\"home.html\" type=\"text/ng-template\">\n  <ion-view title=\"Home\">\n    <ion-content class=\"padding\">\n      <p>Example of Ionic tabs. Navigate to each tab, and\n      navigate to child views of each tab and notice how\n      each tab has its own navigation history.</p>\n      <p>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts\">Scientific Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"facts.html\" type=\"text/ng-template\">\n  <ion-view title=\"Facts\" class=\"padding\">\n    <ion-content>\n      <p>Banging your head against a wall uses 150 calories an hour.</p>\n      <p>Dogs have four toes on their hind feet, and five on their front feet.</p>\n      <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>\n      <p>A cockroach will live nine days without it's head, before it starves to death.</p>\n      <p>Polar bears are left handed.</p>\n      <p>\n        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/facts2\">More Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"facts2.html\" type=\"text/ng-template\">\n  <ion-view title=\"Also Factual\">\n    <ion-content class=\"padding\">\n      <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>\n      <p>1 in every 4 Americans has appeared on T.V.</p>\n      <p>11% of the world is left-handed.</p>\n      <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>\n      <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>\n      <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>\n      <p>\n        <a class=\"button icon ion-home\" href=\"#/tab/home\"> Home</a>\n        <a class=\"button icon ion-chevron-left\" href=\"#/tab/facts\"> Scientific Facts</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"about.html\" type=\"text/ng-template\">\n  <ion-view title=\"About\">\n    <ion-content class=\"padding\">\n      <h3>Create hybrid mobile apps with the web technologies you love.</h3>\n      <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>\n      <p>Built with Sass and optimized for AngularJS.</p>\n      <p>\n        <a class=\"button icon icon-right ion-chevron-right\" href=\"#/tab/navstack\">Tabs Nav Stack</a>\n      </p>\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"nav-stack.html\" type=\"text/ng-template\">\n  <ion-view title=\"Tab Nav Stack\">\n    <ion-content class=\"padding\">\n\n      <p>Almost every mobile application has some form of tab bar interface.</p>\n\n      <p>Ionic has a built-in <code>ion-tabs</code> directive that we can use in order to build our tabbed interface. Create the <code>ion-tabs</code> directive and we can start filling it with tabs. The directive to create a tab is just the <code>ion-tab</code> directive. This takes a title, and this specifies what the title of our tab will be. </p>\n\n      <p>When we save this, we now have a tab that pops up with the text of “Home tab”.</p>\n\n      <p>Let’s add a second tab, because a single-tabbed app is pretty boring. I’m just going to call this one “About”. I’m going to create some equally interesting content.</p>\n\n      <p>We can now swap between our tabs, and see that things happen! We may want to change the color scheme of our tabs. Ionic ships with several colors that are detailed in the documentation in the notes, but if we want to update that, we can set a class of <code>ion-tabs</code>.</p>\n\n      <p>Now, if we look in the documentation, the colors are unprefixed. If we want the blue color, we use the <code>positive</code> class. However, in the case of tabs, we want those to be able to be sub-customizable. For this, we have to prefix this class with ‘tabs-‘. Saving, we now see the nice color.</p>\n\n      <p>Let’s add a header. This can be added with the <code>ion-header-bar</code> directive. Inside, we can set what we want the title to be. Let’s set a color on it. This is interesting, but what if we want a different title for each section of the application?</p>\n\n      <p>You can set a navigation system up, which is detailed in more advanced videos and formulas. For the sake of simplicity in this video, we will create an <code>ion-header-bar</code> in each tab of our app. Copy the header bar, change the titles, and save. We now have updating headers across our tabs!</p>\n\n    </ion-content>\n  </ion-view>\n</script>\n\n<script id=\"contact.html\" type=\"text/ng-template\">\n  <ion-view title=\"Contact\">\n    <ion-content>\n      <p>@IonicFramework</p>\n      <p>@DriftyCo</p>\n    </ion-content>\n  </ion-view>\n</script>\n"
      }
    ],
    "js": [
      {
        "name": "tabsAndNav",
        "component": "ionTabs",
        "id": "ionTabs-tabsAndNav",
        "fileType": ".js",
        "fileName": "index.js",
        "contents": "\nangular.module('tabsAndNav', ['ionic'])\n.config(function ($stateProvider, $urlRouterProvider) {\n\n  $stateProvider\n    .state('tabs', {\n      url: \"/tab\",\n      abstract: true,\n      templateUrl: \"tabs.html\"\n    })\n    .state('tabs.home', {\n      url: \"/home\",\n      views: {\n        'home-tab': {\n          templateUrl: \"home.html\",\n          controller: 'HomeTabCtrl'\n        }\n      }\n    })\n    .state('tabs.facts', {\n      url: \"/facts\",\n      views: {\n        'home-tab': {\n          templateUrl: \"facts.html\"\n        }\n      }\n    })\n    .state('tabs.facts2', {\n      url: \"/facts2\",\n      views: {\n        'home-tab': {\n          templateUrl: \"facts2.html\"\n        }\n      }\n    })\n    .state('tabs.about', {\n      url: \"/about\",\n      views: {\n        'about-tab': {\n          templateUrl: \"about.html\"\n        }\n      }\n    })\n    .state('tabs.navstack', {\n      url: \"/navstack\",\n      views: {\n        'about-tab': {\n          templateUrl: \"nav-stack.html\"\n        }\n      }\n    })\n    .state('tabs.contact', {\n      url: \"/contact\",\n      views: {\n        'contact-tab': {\n          templateUrl: \"contact.html\"\n        }\n      }\n    });\n\n\n  $urlRouterProvider.otherwise(\"/tab/home\");\n\n})\n\n.controller('HomeTabCtrl', function ($scope) {\n  console.log('We have arrived at HomeTabCtrl.');\n});",
        "extension": "js",
        "template": "asset.contents.template",
        "outputPath": "nightly/ionTabs/tabsAndNav/index.js",
        "renderedContent": "\nangular.module('tabsAndNav', ['ionic'])\n.config(function ($stateProvider, $urlRouterProvider) {\n\n  $stateProvider\n    .state('tabs', {\n      url: \"/tab\",\n      abstract: true,\n      templateUrl: \"tabs.html\"\n    })\n    .state('tabs.home', {\n      url: \"/home\",\n      views: {\n        'home-tab': {\n          templateUrl: \"home.html\",\n          controller: 'HomeTabCtrl'\n        }\n      }\n    })\n    .state('tabs.facts', {\n      url: \"/facts\",\n      views: {\n        'home-tab': {\n          templateUrl: \"facts.html\"\n        }\n      }\n    })\n    .state('tabs.facts2', {\n      url: \"/facts2\",\n      views: {\n        'home-tab': {\n          templateUrl: \"facts2.html\"\n        }\n      }\n    })\n    .state('tabs.about', {\n      url: \"/about\",\n      views: {\n        'about-tab': {\n          templateUrl: \"about.html\"\n        }\n      }\n    })\n    .state('tabs.navstack', {\n      url: \"/navstack\",\n      views: {\n        'about-tab': {\n          templateUrl: \"nav-stack.html\"\n        }\n      }\n    })\n    .state('tabs.contact', {\n      url: \"/contact\",\n      views: {\n        'contact-tab': {\n          templateUrl: \"contact.html\"\n        }\n      }\n    });\n\n\n  $urlRouterProvider.otherwise(\"/tab/home\");\n\n})\n\n.controller('HomeTabCtrl', function ($scope) {\n  console.log('We have arrived at HomeTabCtrl.');\n});\n"
      }
    ],
    "scenario.js": [
      {
        "name": "tabsAndNav",
        "component": "ionTabs",
        "id": "ionTabs-tabsAndNav",
        "fileType": ".scenario.js",
        "fileName": "test.scenario.js",
        "contents": "\nit('should go to page 2 in Home tab', function(){\n  var ele = element.all(by.css('ion-nav-view[name=\"home-tab\"] .button'));\n  ele.get(0).click();\n});\n\nit('should go to page 3 in Home tab', function(){\n  var ele = element.all(by.css('ion-nav-view[name=\"home-tab\"] .button'));\n  ele.get(1).click();\n});\n\nit('should go to About tab', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(1).click();\n});\n\nit('should go to page 2 in About tab', function(){\n  var ele = element.all(by.css('ion-nav-view[name=\"about-tab\"] .button'));\n  ele.get(0).click();\n});\n\nit('should go to Contact tab', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(2).click();\n});\n\nit('should go to About tab and still be at page 2', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(1).click();\n});\n\nit('should go to Home tab and still be at page 3', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(0).click();\n});\n\nit('should go back to page 2 in Home tab', function(){\n  var ele = element(by.css('ion-nav-back-button'));\n  ele.click();\n});\n\nit('should go back to page 1 in Home tab', function(){\n  var ele = element(by.css('ion-nav-back-button'));\n  ele.click();\n});\n\nit('should go to About tab and still be at page 2', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(1).click();\n});\n\nit('should go back to page 1 in About tab', function(){\n  var ele = element(by.css('ion-nav-back-button'));\n  ele.click();\n});\n\nit('should go to Home tab and still be at page 1', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(0).click();\n});",
        "extension": "scenario.js",
        "template": "scenario.template.js",
        "outputPath": "nightly/ionTabs/tabsAndNav/test.scenario.js",
        "url": "http://localhost:8876//dist/ionic-demo/nightly/ionTabs/tabsAndNav/",
        "renderedContent": "describe('ionTabs-tabsAndNav', function() {\n\nit('should init', function() {\n  browser.get('http://localhost:8876//dist/ionic-demo/nightly/ionTabs/tabsAndNav/');\n});\n\n\nit('should go to page 2 in Home tab', function(){\n  var ele = element.all(by.css('ion-nav-view[name=\"home-tab\"] .button'));\n  ele.get(0).click();\n});\n\nit('should go to page 3 in Home tab', function(){\n  var ele = element.all(by.css('ion-nav-view[name=\"home-tab\"] .button'));\n  ele.get(1).click();\n});\n\nit('should go to About tab', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(1).click();\n});\n\nit('should go to page 2 in About tab', function(){\n  var ele = element.all(by.css('ion-nav-view[name=\"about-tab\"] .button'));\n  ele.get(0).click();\n});\n\nit('should go to Contact tab', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(2).click();\n});\n\nit('should go to About tab and still be at page 2', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(1).click();\n});\n\nit('should go to Home tab and still be at page 3', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(0).click();\n});\n\nit('should go back to page 2 in Home tab', function(){\n  var ele = element(by.css('ion-nav-back-button'));\n  ele.click();\n});\n\nit('should go back to page 1 in Home tab', function(){\n  var ele = element(by.css('ion-nav-back-button'));\n  ele.click();\n});\n\nit('should go to About tab and still be at page 2', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(1).click();\n});\n\nit('should go back to page 1 in About tab', function(){\n  var ele = element(by.css('ion-nav-back-button'));\n  ele.click();\n});\n\nit('should go to Home tab and still be at page 1', function(){\n  var ele = element.all(by.css('.tabs a'));\n  ele.get(0).click();\n});\n\n});\n"
      }
    ]
  },
  "id": "ionTabs-tabsAndNav",
  "name": "tabsAndNav",
  "component": "ionTabs",
  "href": "/nightly/ionTabs/tabsAndNav/"
};


angular.module('tabsAndNav'
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
      .val(['<html ng-app="tabsAndNav">',
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

