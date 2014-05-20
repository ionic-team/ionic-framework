
/**
 * @ngdoc directive
 * @name ionTabs
 * @module ionic
 * @delegate ionic.service:$ionicTabsDelegate
 * @restrict E
 * @codepen KbrzJ
 *
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages" that can be tabbed
 * through.
 *
 * Assign any [tabs class](/docs/components#tabs) or
 * [animation class](/docs/components#animation) to the element to define
 * its look and feel.
 *
 * See the {@link ionic.directive:ionTab} directive's documentation for more details on
 * individual tabs.
 *
 * Note: do not place ion-tabs inside of an ion-content element; it has been known to cause a
 * certain CSS bug.
 *
 * @usage
 * ```html
 * <ion-tabs class="tabs-positive tabs-icon-only">
 *
 *   <ion-tab title="Home" icon-on="ion-ios7-filing" icon-off="ion-ios7-filing-outline">
 *     <!-- Tab 1 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="About" icon-on="ion-ios7-clock" icon-off="ion-ios7-clock-outline">
 *     <!-- Tab 2 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="Settings" icon-on="ion-ios7-gear" icon-off="ion-ios7-gear-outline">
 *     <!-- Tab 3 content -->
 *   </ion-tab>
 *
 * </ion-tabs>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify these tabs
 * with {@link ionic.service:$ionicTabsDelegate}.
 */
/**
 * @ngdoc demo
 * @name ionTabs#navigation
 * @module tabsAndNavigation
 * @javascript
angular.module('tabsAndNavigation', ['ionic'])
.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "facts.html"
        }
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "facts2.html"
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "contact.html"
        }
      }
    });


  $urlRouterProvider.otherwise("/tab/home");

})

.controller('HomeTabCtrl', function ($scope) {
  console.log('We have arrived at HomeTabCtrl.');
});
 *
 * @html
<ion-nav-bar class="nav-title-slide-ios7 bar-positive">
  <ion-nav-back-button class="button-icon ion-arrow-left-c">
  </ion-nav-back-button>
</ion-nav-bar>

<ion-nav-view animation="slide-left-right"></ion-nav-view>

<script id="tabs.html" type="text/ng-template">
  <ion-tabs class="tabs-icon-top tabs-positive">

    <ion-tab title="Home" icon="ion-home" href="#/tab/home">
      <ion-nav-view name="home-tab"></ion-nav-view>
    </ion-tab>

    <ion-tab title="About" icon="ion-ios7-information" href="#/tab/about">
      <ion-nav-view name="about-tab"></ion-nav-view>
    </ion-tab>

    <ion-tab title="Contact" icon="ion-ios7-world" ui-sref="tabs.contact">
      <ion-nav-view name="contact-tab"></ion-nav-view>
    </ion-tab>

  </ion-tabs>
</script>

<script id="home.html" type="text/ng-template">
  <ion-view title="Home">
    <ion-content class="padding">
      <p>Example of Ionic tabs. Navigate to each tab, and
      navigate to child views of each tab and notice how
      each tab has its own navigation history.</p>
      <p>
        <a class="button icon icon-right ion-chevron-right" href="#/tab/facts">Scientific Facts</a>
      </p>
    </ion-content>
  </ion-view>
</script>

<script id="facts.html" type="text/ng-template">
  <ion-view title="Facts" class="padding">
    <ion-content>
      <p>Banging your head against a wall uses 150 calories an hour.</p>
      <p>Dogs have four toes on their hind feet, and five on their front feet.</p>
      <p>The ant can lift 50 times its own weight, can pull 30 times its own weight and always falls over on its right side when intoxicated.</p>
      <p>A cockroach will live nine days without it's head, before it starves to death.</p>
      <p>Polar bears are left handed.</p>
      <p>
        <a class="button icon ion-home" href="#/tab/home"> Home</a>
        <a class="button icon icon-right ion-chevron-right" href="#/tab/facts2">More Facts</a>
      </p>
    </ion-content>
  </ion-view>
</script>

<script id="facts2.html" type="text/ng-template">
  <ion-view title="Also Factual">
    <ion-content class="padding">
      <p>111,111,111 x 111,111,111 = 12,345,678,987,654,321</p>
      <p>1 in every 4 Americans has appeared on T.V.</p>
      <p>11% of the world is left-handed.</p>
      <p>1 in 8 Americans has worked at a McDonalds restaurant.</p>
      <p>$283,200 is the absolute highest amount of money you can win on Jeopardy.</p>
      <p>101 Dalmatians, Peter Pan, Lady and the Tramp, and Mulan are the only Disney cartoons where both parents are present and don't die throughout the movie.</p>
      <p>
        <a class="button icon ion-home" href="#/tab/home"> Home</a>
        <a class="button icon ion-chevron-left" href="#/tab/facts"> Scientific Facts</a>
      </p>
    </ion-content>
  </ion-view>
</script>

<script id="about.html" type="text/ng-template">
  <ion-view title="About">
    <ion-content class="padding">
      <h3>Create hybrid mobile apps with the web technologies you love.</h3>
      <p>Free and open source, Ionic offers a library of mobile-optimized HTML, CSS and JS components for building highly interactive apps.</p>
      <p>Built with Sass and optimized for AngularJS.</p>
      <p>
        <a class="button icon icon-right ion-chevron-right" href="#/tab/navstack">Tabs Nav Stack</a>
      </p>
    </ion-content>
  </ion-view>
</script>

<script id="nav-stack.html" type="text/ng-template">
  <ion-view title="Tab Nav Stack">
    <ion-content class="padding">
      <p><img src="http://ionicframework.com/img/diagrams/tabs-nav-stack.png" style="width:100%"></p>
    </ion-content>
  </ion-view>
</script>

<script id="contact.html" type="text/ng-template">
  <ion-view title="Contact">
    <ion-content>
      <p>@IonicFramework</p>
      <p>@DriftyCo</p>
    </ion-content>
  </ion-view>
</script>
*/

IonicModule
.directive('ionTabs', [
  '$ionicViewService', 
  '$ionicTabsDelegate', 
function($ionicViewService, $ionicTabsDelegate) {
  return {
    restrict: 'E',
    scope: true,
    controller: '$ionicTabs',
    compile: function(element, attr) {
      element.addClass('view');
      //We cannot use regular transclude here because it breaks element.data()
      //inheritance on compile
      var innerElement = jqLite('<div class="tabs"></div>');
      innerElement.append(element.contents());
      element.append(innerElement);

      return { pre: prelink };
      function prelink($scope, $element, $attr, tabsCtrl) {
        var deregisterInstance = $ionicTabsDelegate._registerInstance(
          tabsCtrl, $attr.delegateHandle
        );

        $scope.$on('$destroy', deregisterInstance);

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = jqLite($element[0].querySelector('.tabs'));

        var el = $element[0];
        $scope.$watch(function() { return el.className; }, function(value) {
          var isTabsTop = value.indexOf('tabs-top') !== -1;
          var isHidden = value.indexOf('tabs-item-hide') !== -1;
          $scope.$hasTabs = !isTabsTop && !isHidden;
          $scope.$hasTabsTop = isTabsTop && !isHidden;
        });
        $scope.$on('$destroy', function() {
          delete $scope.$hasTabs;
          delete $scope.$hasTabsTop;
        });
      }
    }
  };
}]);
