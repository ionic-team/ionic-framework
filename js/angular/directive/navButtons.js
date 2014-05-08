/**
 * @ngdoc directive
 * @name ionNavButtons
 * @module ionic
 * @restrict E
 * @parent ionNavView
 *
 * @description
 * Use ionNavButtons to set the buttons on your {@link ionic.directive:ionNavBar}
 * from within an {@link ionic.directive:ionView}.
 *
 * Any buttons you declare will be placed onto the navbar's corresponding side,
 * and then destroyed when the user leaves their parent view.
 *
 * @usage
 * ```html
 * <ion-nav-bar>
 * </ion-nav-bar>
 * <ion-nav-view>
 *   <ion-view>
 *     <ion-nav-buttons side="left">
 *       <button class="button" ng-click="doSomething()">
 *         I'm a button on the left of the navbar!
 *       </button>
 *     </ion-nav-buttons>
 *     <ion-content>
 *       Some super content here!
 *     </ion-content>
 *   </ion-view>
 * </ion-nav-view>
 * ```
 *
 * @param {string} side The side to place the buttons on in the parent
 * {@link ionic.directive:ionNavBar}. Available: 'left' or 'right'.
 */
IonicModule
.directive('ionNavButtons', ['$compile', '$animate', function($compile, $animate) {
  return {
    require: '^ionNavBar',
    restrict: 'E',
    compile: function($element, $attrs) {
      var content = $element.contents().remove();
      return function($scope, $element, $attrs, navBarCtrl) {
        var navElement = $attrs.side === 'right' ?
          navBarCtrl.rightButtonsElement :
          navBarCtrl.leftButtonsElement;

        //Put all of our inside buttons into their own span,
        //so we can remove them all when this element dies -
        //even if the buttons have changed through an ng-repeat or the like,
        //we just remove their div parent and they are gone.
        var buttons = jqLite('<span>').append(content);

        //Compile buttons inside content so they have access to everything
        //something inside content does (eg parent ionicScroll)
        $element.append(buttons);
        $compile(buttons)($scope);

        //Append buttons to navbar
        ionic.requestAnimationFrame(function() {
          //If the scope is destroyed before raf runs, be sure not to enter
          if (!$scope.$$destroyed) {
            $animate.enter(buttons, navElement);
          }
        });

        //When our ion-nav-buttons container is destroyed,
        //destroy everything in the navbar
        $scope.$on('$destroy', function() {
          $animate.leave(buttons);
        });

        // The original element is just a completely empty <ion-nav-buttons> element.
        // make it invisible just to be sure it doesn't change any layout
        $element.css('display', 'none');
      };
    }
  };
}]);
