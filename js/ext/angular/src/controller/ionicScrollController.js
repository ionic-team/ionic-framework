(function() {
'use strict';

angular.module('ionic.ui.scroll')

/**
 * @private
 */
.controller('$ionicScroll', ['$scope', 'scrollViewOptions', '$timeout', '$ionicScrollDelegate', '$window', function($scope, scrollViewOptions, $timeout, $ionicScrollDelegate, $window) {

  var self = this;

  var element = this.element = scrollViewOptions.el;
  var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);

  if (!angular.isDefined(scrollViewOptions.bouncing)) {
    ionic.Platform.ready(function() {
      scrollView.options.bouncing = !ionic.Platform.isAndroid();
    });
  }

  var $element = this.$element = angular.element(element);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  $element.data('$$ionicScrollController', this);

  //Register delegate for event handling
  $ionicScrollDelegate.register($scope, $element, scrollView);

  $window.addEventListener('resize', resize);
  $scope.$on('$destroy', function() {
    $window.removeEventListener('resize', resize);
  });
  function resize() {
    scrollView.resize();
  }

  this.setRefresher = function(refresherScope, refresherElement) {
    var refresher = this.refresher = refresherElement;
    var refresherHeight = self.refresher.clientHeight || 0;
    scrollView.activatePullToRefresh(refresherHeight, function() {
      refresher.classList.add('active');
      refresherScope.$onRefreshOpening();
    }, function() {
      refresher.classList.remove('refreshing');
      refresher.classList.remove('active');
    }, function() {
      refresher.classList.add('refreshing');
      refresherScope.$onRefresh();
    });
  };

  $timeout(function() {
    scrollView.run();
  });
}]);

})();
