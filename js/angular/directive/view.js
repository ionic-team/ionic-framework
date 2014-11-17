/**
 * @ngdoc directive
 * @name ionView
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * A container for view content and any navigational and header bar information.
 * When a view enters and exists its parent {@link ionic.directive:ionNavView}, the view
 * also emits view information, such as its title, if the back button should show or not, if
 * the corresponding {@link ionic.directive:ionNavBar} should show or not, which transition the view
 * should use to animate, and what direction to animate.
 *
 * Views are cached to improve performance. When a view is navigated away from, its
 * element is left in the DOM, and its scope is disconnected from the cycle. When navigating
 * to a view which is already cached, its scope is reconnected, and the existing element which
 * was left in the DOM becomes the active view. Config variables can be used to disable this
 * feature, or change the maximum number of views which can be cached.
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
 * Views can be cached which means controllers may only load once, which could change how you'd
 * expect controllers to fire. To know when a view has entered or left, events have been added that
 * get emitted from the view's scope. These events also contain data about the view,
 * such as the title and if the back button should show, along with transition data, such as the
 * transition type and direction that will be or was used.
 *
 * * `$ionicView.loaded`: The view has loaded. This event only happens once per the scope being created
 * and view element added to the DOM. If a view leaves and is cached, then a subsequent time it enters
 * this this event will not fire again, rather it would only fire again if the view was not cached
 * and accessed again. This is good place to put your setup code for the View.
 * * `$ionicView.enter`: The view has fully entered and is now the active view. This event will fire
 * no matter if it was the first load or it was a cached view.
 * * `$ionicView.leave`: The view has finished leaving and is no longer the active view. This event will
 * fire no matter if it will be cached or destroyed.
 * * `$ionicView.beforeEnter`: The view is about to enter and become the active view.
 * * `$ionicView.beforeLeave`: The view is about to leave and no longer be the active view.
 * * `$ionicView.afterEnter`: The view has fully entered and is now the active view.
 * * `$ionicView.afterLeave`: The view has finished leaving and is no longer the active view.
 *
 *## Caching
 *
 *Caching can disabled/enabled by multiple ways. By default, Ionic will cache a maximum of 10 views. You can optionally choose to disable caching a view through the `cache-view` attribute directive.
 *
 *```html
 *<ion-view cache-view="false" view-title="My Title"></ion-view>
 *```
 *
 *Alternatively, you could choose to disable caching through `$stateProvider.state`.
 *
 *```
 *$stateProvider.state('myState', {
 *  cache: false,
 *  url : '/myUrl',
 *  views: {
 *    'nav-view': {
 *      templateUrl : 'my-template.html'
 *    }
 *  }
 *})
 *```
 *
 *If you wish to disable caching globally in an app, you can edit the `$ionicConfigProvider.views.maxCache`
 *
 *```
 *$ionicConfigProvider.views.maxCache(0);
 *```
 *
 *In this instance we’re setting the number of cached views to 0, essentially disabling the caching functionality.
 *
 *Note that because we are caching these views, we aren’t destroying scopes. Instead, scopes are being disconnected.
 *Then when you travel back to that cached view, the scopes get reconnected.
 *
 *
 * @param {string=} view-title The title to display on the parent {@link ionic.directive:ionNavBar}.
 * @param {boolean=} cache-view If this view should be allowed to be cached or not. Default `true`
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
