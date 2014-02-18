(function(ionic) {
'use strict';

angular.module('ionic.ui.header', ['ngAnimate'])

.directive('barHeader', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'C',
    link: function($scope, $element, $attr) {
      // We want to scroll to top when the top of this element is clicked
      $ionicScrollDelegate.tapScrollToTop($element);
    }
  };
}])

.directive('ionHeaderBar', ['$ionicScrollDelegate', function($ionicScrollDelegate) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<header class="bar bar-header">\
                <div class="buttons">\
                  <button ng-repeat="button in leftButtons" class="button no-animation" ng-class="button.type" ng-click="button.tap($event, $index)" ion-bind-html-unsafe="button.content">\
                  </button>\
                </div>\
                <h1 class="title" ion-bind-html-unsafe="title"></h1>\
                <div class="buttons">\
                  <button ng-repeat="button in rightButtons" class="button no-animation" ng-class="button.type" ng-click="button.tap($event, $index)" ion-bind-html-unsafe="button.content">\
                  </button>\
                </div>\
              </header>',

    scope: {
      leftButtons: '=',
      rightButtons: '=',
      title: '=',
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

      $scope.$watch('leftButtons', function(val) {
        // Resize the title since the buttons have changed
        hb.align();
      });

      $scope.$watch('rightButtons', function(val) {
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
