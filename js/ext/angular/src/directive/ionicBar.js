(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate', 'ngSanitize'])

.directive('barHeader', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      $ionicScrollDelegate($scope).tapScrollToTop($element);
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionHeaderBar
 * @module ionic
 * @restrict E
 * @controller ionicBar
 *
 * @description
 * Adds a fixed header bar above some content.
 *
 * Is able to have left or right buttons, and additionally its title can be
 * aligned through the {@link ionic.controller:ionicBar ionicBar controller}.
 *
 * @param {string=} model The model to assign this headerBar's
 * {@link ionic.controller:ionicBar ionicBar controller} to.
 * Defaults to assigning to $scope.headerBarController.
 * @param {string=} align-title Where to align the title at the start.
 * Avaialble: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-header-bar align-title="left" class="bar-positive">
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-header-bar>
 * <ion-content>
 *   Some content!
 * </ion-content>
 * ```
 */
.directive('ionHeaderBar', barDirective(true))

/**
 * @ngdoc directive
 * @name ionFooterBar
 * @module ionic
 * @restrict E
 * @controller ionicBar
 *
 * @description
 * Adds a fixed footer bar below some content.
 *
 * Is able to have left or right buttons, and additionally its title can be
 * aligned through the {@link ionic.controller:ionicBar ionicBar controller}.
 *
 * @param {string=} model The model to assign this footerBar's
 * {@link ionic.controller:ionicBar ionicBar controller} to.
 * Defaults to assigning to $scope.footerBarController.
 * @param {string=} align-title Where to align the title at the start.
 * Avaialble: 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Some content!
 * </ion-content>
 * <ion-footer-bar align-title="left" class="bar-assertive">
 *   <div class="buttons">
 *     <button class="button">Left Button</button>
 *   </div>
 *   <h1 class="title">Title!</h1>
 *   <div class="buttons">
 *     <button class="button">Right Button</button>
 *   </div>
 * </ion-footer-bar>
 * ```
 */
.directive('ionFooterBar', barDirective(false));

function barDirective(isHeader) {
  var BAR_TEMPLATE = isHeader ?
    '<header class="bar bar-header" ng-transclude></header>' :
    '<footer class="bar bar-footer" ng-transclude></footer>';
  var BAR_MODEL_DEFAULT = isHeader ?
    'headerBarController' :
    'footerBarController';
  return ['$parse', function($parse) {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: BAR_TEMPLATE,
      link: function($scope, $element, $attr) {
        var hb = new ionic.views.HeaderBar({
          el: $element[0],
          alignTitle: $attr.alignTitle || 'center'
        });

        $parse($attr.model || BAR_MODEL_DEFAULT).assign($scope.$parent || $scope, hb);
      }
    };
  }];
}

})(ionic);
