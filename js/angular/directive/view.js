/**
 * @ngdoc directive
 * @name ionView
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * A container for view content and any navigational and header bar information. When a view
 * enters and exits its parent {@link ionic.directive:ionNavView}, the view also emits view
 * information, such as its title, whether the back button should be displayed or not, whether the
 * corresponding {@link ionic.directive:ionNavBar} should be displayed or not, which transition the view
 * should use to animate, and which direction to animate.
 *
 * *Views are cached to improve performance.* When a view is navigated away from, its element is
 * left in the DOM, and its scope is disconnected from the `$watch` cycle. When navigating to a
 * view that is already cached, its scope is reconnected, and the existing element, which was
 * left in the DOM, becomes active again. This can be disabled, or the maximum number of cached
 * views changed in {@link ionic.provider:$ionicConfigProvider}, in the view's `$state` configuration, or
 * as an attribute on the view itself (see below).
 *
 * @usage
 * Below is an example where our page will load with a {@link ionic.directive:ionNavBar} containing
 * "My Page" as the title.
 *
 * ```html
 * <ion-nav-bar></ion-nav-bar>
 * <ion-nav-view>
 *   <ion-view view-title="My Page">
 *     <ion-content>
 *       Hello!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * ## View LifeCycle and Events
 *
 * Views can be cached, which means ***controllers normally only load once***, which may
 * affect your controller logic. To know when a view has entered or left, events
 * have been added that are emitted from the view's scope. These events also
 * contain data about the view, such as the title and whether the back button should
 * show. Also contained is transition data, such as the transition type and
 * direction that will be or was used.
 *
 * Life cycle events are emitted upwards from the transitioning view's scope. In some cases, it is
 * desirable for a child/nested view to be notified of the event.
 * For this use case, `$ionicParentView` life cycle events are broadcast downwards.
 *
 * <table class="table">
 *  <tr>
 *   <td><code>$ionicView.loaded</code></td>
 *   <td>The view has loaded. This event only happens once per
 * view being created and added to the DOM. If a view leaves but is cached,
 * then this event will not fire again on a subsequent viewing. The loaded event
 * is good place to put your setup code for the view; however, it is not the
 * recommended event to listen to when a view becomes active.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.enter</code></td>
 *   <td>The view has fully entered and is now the active view.
 * This event will fire, whether it was the first load or a cached view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.leave</code></td>
 *   <td>The view has finished leaving and is no longer the
 * active view. This event will fire, whether it is cached or destroyed.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.beforeEnter</code></td>
 *   <td>The view is about to enter and become the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.beforeLeave</code></td>
 *   <td>The view is about to leave and no longer be the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.afterEnter</code></td>
 *   <td>The view has fully entered and is now the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.afterLeave</code></td>
 *   <td>The view has finished leaving and is no longer the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicView.unloaded</code></td>
 *   <td>The view's controller has been destroyed and its element has been
 * removed from the DOM.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicParentView.enter</code></td>
 *   <td>The parent view has fully entered and is now the active view.
 * This event will fire, whether it was the first load or a cached view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicParentView.leave</code></td>
 *   <td>The parent view has finished leaving and is no longer the
 * active view. This event will fire, whether it is cached or destroyed.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicParentView.beforeEnter</code></td>
 *   <td>The parent view is about to enter and become the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicParentView.beforeLeave</code></td>
 *   <td>The parent view is about to leave and no longer be the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicParentView.afterEnter</code></td>
 *   <td>The parent view has fully entered and is now the active view.</td>
 *  </tr>
 *  <tr>
 *   <td><code>$ionicParentView.afterLeave</code></td>
 *   <td>The parent view has finished leaving and is no longer the active view.</td>
 *  </tr>
 * </table>
 *
 * ## LifeCycle Event Usage
 *
 * Below is an example of how to listen to life cycle events and
 * access state parameter data
 *
 * ```js
 * $scope.$on("$ionicView.beforeEnter", function(event, data){
 *    // handle event
 *    console.log("State Params: ", data.stateParams);
 * });
 *
 * $scope.$on("$ionicView.enter", function(event, data){
 *    // handle event
 *    console.log("State Params: ", data.stateParams);
 * });
 *
 * $scope.$on("$ionicView.afterEnter", function(event, data){
 *    // handle event
 *    console.log("State Params: ", data.stateParams);
 * });
 * ```
 *
 * ## Caching
 *
 * Caching can be disabled and enabled in multiple ways. By default, Ionic will
 * cache a maximum of 10 views. You can optionally choose to disable caching at
 * either an individual view basis, or by global configuration. Please see the
 * _Caching_ section in {@link ionic.directive:ionNavView} for more info.
 *
 * @param {string=} view-title A text-only title to display on the parent {@link ionic.directive:ionNavBar}.
 * For an HTML title, such as an image, see {@link ionic.directive:ionNavTitle} instead.
 * @param {boolean=} cache-view If this view should be allowed to be cached or not.
 * Please see the _Caching_ section in {@link ionic.directive:ionNavView} for
 * more info. Default `true`
 * @param {boolean=} can-swipe-back If this view should be allowed to use the swipe to go back gesture or not.
 * This does not enable the swipe to go back feature if it is not available for the platform it's running
 * from, or there isn't a previous view. Default `true`
 * @param {boolean=} hide-back-button Whether to hide the back button on the parent
 * {@link ionic.directive:ionNavBar} by default.
 * @param {boolean=} hide-nav-bar Whether to hide the parent
 * {@link ionic.directive:ionNavBar} by default.
 */
IonicModule
.directive('ionView', function() {
  return {
    restrict: 'EA',
    priority: 1000,
    controller: '$ionicView',
    compile: function(tElement) {
      tElement.addClass('pane');
      tElement[0].removeAttribute('title');
      return function link($scope, $element, $attrs, viewCtrl) {
        viewCtrl.init();
      };
    }
  };
});
