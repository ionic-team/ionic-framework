/**
 * @ngdoc directive
 * @name ionNavView
 * @module ionic
 * @restrict E
 * @codepen odqCz
 *
 * @description
 * As a user navigates throughout your app, Ionic is able to keep track of their
 * navigation history. By knowing their history, transitions between views
 * correctly enter and exit using the platform's transition style. An additional
 * benefit to Ionic's navigation system is its ability to manage multiple
 * histories. For example, each tab can have it's own navigation history stack.
 *
 * Ionic uses the AngularUI Router module so app interfaces can be organized
 * into various "states". Like Angular's core $route service, URLs can be used
 * to control the views. However, the AngularUI Router provides a more powerful
 * state manager in that states are bound to named, nested, and parallel views,
 * allowing more than one template to be rendered on the same page.
 * Additionally, each state is not required to be bound to a URL, and data can
 * be pushed to each state which allows much flexibility.
 *
 * The ionNavView directive is used to render templates in your application. Each template
 * is part of a state. States are usually mapped to a url, and are defined programatically
 * using angular-ui-router (see [their docs](https://github.com/angular-ui/ui-router/wiki),
 * and remember to replace ui-view with ion-nav-view in examples).
 *
 * @usage
 * In this example, we will create a navigation view that contains our different states for the app.
 *
 * To do this, in our markup we use ionNavView top level directive. To display a header bar we use
 * the {@link ionic.directive:ionNavBar} directive that updates as we navigate through the
 * navigation stack.
 *
 * Next, we need to setup our states that will be rendered.
 *
 * ```js
 * var app = angular.module('myApp', ['ionic']);
 * app.config(function($stateProvider) {
 *   $stateProvider
 *   .state('index', {
 *     url: '/',
 *     templateUrl: 'home.html'
 *   })
 *   .state('music', {
 *     url: '/music',
 *     templateUrl: 'music.html'
 *   });
 * });
 * ```
 * Then on app start, $stateProvider will look at the url, see it matches the index state,
 * and then try to load home.html into the `<ion-nav-view>`.
 *
 * Pages are loaded by the URLs given. One simple way to create templates in Angular is to put
 * them directly into your HTML file and use the `<script type="text/ng-template">` syntax.
 * So here is one way to put home.html into our app:
 *
 * ```html
 * <script id="home" type="text/ng-template">
 *   <!-- The title of the ion-view will be shown on the navbar -->
 *   <ion-view view-title="Home">
 *     <ion-content ng-controller="HomeCtrl">
 *       <!-- The content of the page -->
 *       <a href="#/music">Go to music page!</a>
 *     </ion-content>
 *   </ion-view>
 * </script>
 * ```
 *
 * This is good to do because the template will be cached for very fast loading, instead of
 * having to fetch them from the network.
 *
 * ## Caching
 *
 * By default, views are cached to improve performance. When a view is navigated away from, its
 * element is left in the DOM, and its scope is disconnected from the `$watch` cycle. When
 * navigating to a view that is already cached, its scope is then reconnected, and the existing
 * element that was left in the DOM becomes the active view. This also allows for the scroll
 * position of previous views to be maintained.
 *
 * Caching can be disabled and enabled in multiple ways. By default, Ionic will cache a maximum of
 * 10 views, and not only can this be configured, but apps can also explicitly state which views
 * should and should not be cached.
 *
 * Note that because we are caching these views, *we aren’t destroying scopes*. Instead, scopes
 * are being disconnected from the watch cycle. Because scopes are not being destroyed and
 * recreated, controllers are not loading again on a subsequent viewing. If the app/controller
 * needs to know when a view has entered or has left, then view events emitted from the
 * {@link ionic.directive:ionView} scope, such as `$ionicView.enter`, may be useful.
 *
 * By default, when navigating back in the history, the "forward" views are removed from the cache.
 * If you navigate forward to the same view again, it'll create a new DOM element and controller
 * instance. Basically, any forward views are reset each time. This can be configured using the
 * {@link ionic.provider:$ionicConfigProvider}:
 *
 * ```js
 * $ionicConfigProvider.views.forwardCache(true);
 * ```
 *
 * #### Disable cache globally
 *
 * The {@link ionic.provider:$ionicConfigProvider} can be used to set the maximum allowable views
 * which can be cached, but this can also be use to disable all caching by setting it to 0.
 *
 * ```js
 * $ionicConfigProvider.views.maxCache(0);
 * ```
 *
 * #### Disable cache within state provider
 *
 * ```js
 * $stateProvider.state('myState', {
 *    cache: false,
 *    url : '/myUrl',
 *    templateUrl : 'my-template.html'
 * })
 * ```
 *
 * #### Disable cache with an attribute
 *
 * ```html
 * <ion-view cache-view="false" view-title="My Title!">
 *   ...
 * </ion-view>
 * ```
 *
 *
 * ## AngularUI Router
 *
 * Please visit [AngularUI Router's docs](https://github.com/angular-ui/ui-router/wiki) for
 * more info. Below is a great video by the AngularUI Router team that may help to explain
 * how it all works:
 *
 * <iframe width="560" height="315" src="//www.youtube.com/embed/dqJRoh8MnBo"
 * frameborder="0" allowfullscreen></iframe>
 *
 * @param {string=} name A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states. For more
 * information, see ui-router's
 * [ui-view documentation](http://angular-ui.github.io/ui-router/site/#/api/ui.router.state.directive:ui-view).
 */
IonicModule
.directive('ionNavView', [
  '$state',
  '$ionicConfig',
function($state, $ionicConfig) {
  // IONIC's fork of Angular UI Router, v0.2.10
  // the navView handles registering views in the history and how to transition between them
  return {
    restrict: 'E',
    terminal: true,
    priority: 2000,
    transclude: true,
    controller: '$ionicNavView',
    compile: function(tElement, tAttrs, transclude) {

      // a nav view element is a container for numerous views
      tElement.addClass('view-container');
      ionic.DomUtil.cachedAttr(tElement, 'nav-view-transition', $ionicConfig.views.transition());

      return function($scope, $element, $attr, navViewCtrl) {
        var latestLocals;

        // Put in the compiled initial view
        transclude($scope, function(clone) {
          $element.append(clone);
        });

        var viewData = navViewCtrl.init();

        // listen for $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function() {
          updateView(false);
        });
        $scope.$on('$viewContentLoading', function() {
          updateView(false);
        });

        // initial load, ready go
        updateView(true);


        function updateView(firstTime) {
          // get the current local according to the $state
          var viewLocals = $state.$current && $state.$current.locals[viewData.name];

          // do not update THIS nav-view if its is not the container for the given state
          // if the viewLocals are the same as THIS latestLocals, then nothing to do
          if (!viewLocals || (!firstTime && viewLocals === latestLocals)) return;

          // update the latestLocals
          latestLocals = viewLocals;
          viewData.state = viewLocals.$$state;

          // register, update and transition to the new view
          navViewCtrl.register(viewLocals);
        }

      };
    }
  };
}]);
