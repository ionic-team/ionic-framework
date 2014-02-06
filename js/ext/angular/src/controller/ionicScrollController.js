(function() {
'use strict';

angular.module('ionic.ui.scroll')

.controller('$ionicScroll', ['$scope', 'scrollViewOptions', '$timeout',
                     function($scope,   scrollViewOptions,   $timeout) {

  scrollViewOptions.bouncing = angular.isDefined(scrollViewOptions.bouncing) ?
    scrollViewOptions.bouncing :
    !ionic.Platform.isAndroid();

  var element = this.element = scrollViewOptions.el;
  var refresher = this.refresher = element.querySelector('.scroll-refresher');
  var scrollView = this.scrollView = new ionic.views.Scroll(scrollViewOptions);

  this.$element = angular.element(element);

  //Attach self to element as a controller so other directives can require this controller
  //through `require: '$ionicScroll'
  this.$element.data('$$ionicScrollController', this);

  $timeout(function() {
    scrollView.run();

    // Activate pull-to-refresh
    if(refresher) {
      var refresherHeight = refresher.clientHeight || 0;
      scrollView.activatePullToRefresh(refresherHeight, function() {
        refresher.classList.add('active');
      }, function() {
        refresher.classList.remove('refreshing');
        refresher.classList.remove('active');
      }, function() {
        refresher.classList.add('refreshing');
        $scope.onRefresh && $scope.onRefresh();
        $scope.$parent.$broadcast('scroll.onRefresh');
      });
    }
  });

}]);

})();
