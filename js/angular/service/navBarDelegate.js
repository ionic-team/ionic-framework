
/**
 * @ngdoc service
 * @name $ionicNavBarDelegate
 * @module ionic
 * @description
 * Delegate for controlling the {@link ionic.directive:ionNavBar} directive.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <ion-nav-bar>
 *     <button ng-click="setNavTitle('banana')">
 *       Set title to banana!
 *     </button>
 *   </ion-nav-bar>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicNavBarDelegate) {
 *   $scope.setNavTitle = function(title) {
 *     $ionicNavBarDelegate.setTitle(title);
 *   }
 * }
 * ```
 */
IonicModule
.service('$ionicNavBarDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#back
   * @description Goes back in the view history.
   * @param {DOMEvent=} event The event object (eg from a tap event)
   */
  'back',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#align
   * @description Aligns the title with the buttons in a given direction.
   * @param {string=} direction The direction to the align the title text towards.
   * Available: 'left', 'right', 'center'. Default: 'center'.
   */
  'align',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#showBackButton
   * @description
   * Set/get whether the {@link ionic.directive:ionNavBackButton} is shown
   * (if it exists).
   * @param {boolean=} show Whether to show the back button.
   * @returns {boolean} Whether the back button is shown.
   */
  'showBackButton',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#showBar
   * @description
   * Set/get whether the {@link ionic.directive:ionNavBar} is shown.
   * @param {boolean} show Whether to show the bar.
   * @returns {boolean} Whether the bar is shown.
   */
  'showBar',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#setTitle
   * @description
   * Set the title for the {@link ionic.directive:ionNavBar}.
   * @param {string} title The new title to show.
   */
  'setTitle',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#changeTitle
   * @description
   * Change the title, transitioning the new title in and the old one out in a given direction.
   * @param {string} title The new title to show.
   * @param {string} direction The direction to transition the new title in.
   * Available: 'forward', 'back'.
   */
  'changeTitle',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#getTitle
   * @returns {string} The current title of the navbar.
   */
  'getTitle',
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#getPreviousTitle
   * @returns {string} The previous title of the navbar.
   */
  'getPreviousTitle'
  /**
   * @ngdoc method
   * @name $ionicNavBarDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * navBars with delegate-handle matching the given handle.
   *
   * Example: `$ionicNavBarDelegate.$getByHandle('myHandle').setTitle('newTitle')`
   */
]));
