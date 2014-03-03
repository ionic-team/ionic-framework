(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate', 'ngSanitize'])

.directive('barHeader', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      // We want to scroll to top when the top of this element is clicked
      $ionicScrollDelegate.tapScrollToTop($element);
    }
  };
}])

/**
 * @ngdoc directive
 * @name ionHeaderBar
 * @module ionic
 * @restrict E
 * @description
 * While Ionic provides simple Header and Footer bars that can be created through
 * HTML and CSS alone, Header bars specifically can be extended in order to
 * provide dynamic layout features such as auto-title centering and animation.
 * They are also used by the Views and Navigation Controller to animate a title
 * on navigation and toggle a back button.
 * *
 * The main header bar feature provide is auto title centering.
 * In this situation, the title text will center itself until either the
 * left or right button content is too wide for the label to center.
 * In that case, it will slide left or right until it can fit.
 * You can also align the title left for a more Android-friendly header.
 *
 * Using two-way data binding, the header bar will automatically
 * readjust the heading title alignment when the title or buttons change.
 *
 * @param {string} title The title use on the headerBar.
 * @param {expression=} leftButtons Point to an array of buttons to put on the left of the bar.
 * @param {expression=} rightButtons Point to an array of buttons to put on the right of the bar.
 * @param {string=} type The type of the bar, for example 'bar-positive'.
 * @param {string=} align Where to align the title. 'left', 'right', or 'center'.  Defaults to 'center'.
 *
 * @usage
 * ```html
 * <ion-header-bar
 *  title="{{myTitle}}"
 *  left-buttons="leftButtons"
 *  right-buttons="rightButtons"
 *  type="bar-positive"
 *  align-title="center">
 * </ion-header-bar>
 * ```
 * 
 */
.directive('ionHeaderBar', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<header class="bar bar-header">\
                <div class="buttons">\
                  <button ng-repeat="button in leftButtons" class="button no-animation" ng-class="button.type" ng-click="button.tap($event, $index)" ng-bind-html="button.content">\
                  </button>\
                </div>\
                <h1 class="title" ng-bind-html="title"></h1>\
                <div class="buttons">\
                  <button ng-repeat="button in rightButtons" class="button no-animation" ng-class="button.type" ng-click="button.tap($event, $index)" ng-bind-html="button.content">\
                  </button>\
                </div>\
              </header>',

    scope: {
      leftButtons: '=',
      rightButtons: '=',
      title: '@',
      type: '@',
      alignTitle: '@'
    },

    link: function($scope, $element, $attr) {
      var hb = new ionic.views.HeaderBar({
        el: $element[0],
        alignTitle: $scope.alignTitle || 'center'
      });

      $element.addClass($scope.type);

      $scope.headerBarView = hb;

      $scope.$watchCollection('leftButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watchCollection('rightButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watch('title', function(val) {
        // Resize the title since the title has changed
        hb.align();
      });
    }
  };
}])

.directive('ionFooterBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<footer class="bar bar-footer" ng-transclude>\
              </footer>',

    scope: {
      type: '@',
    },

    link: function($scope, $element, $attr) {
      $element.addClass($scope.type);
    }
  };
});

})(ionic);
