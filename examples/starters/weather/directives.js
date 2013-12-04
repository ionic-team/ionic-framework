angular.module('ionic.weather.directives', [])

.directive('currentTime', function($timeout, $filter) {
  return {
    restrict: 'E',
    replace: true,
    template: '<span class="current-time">{{currentTime}}</span>',
    scope: {
      localtz: '=',
    },
    link: function($scope, $element, $attr) {
      $timeout(function checkTime() {
        if($scope.localtz) {
          $scope.currentTime = $filter('date')(+(new Date), 'h:mm') + $scope.localtz;
        }
        $timeout(checkTime, 500);
      });
    }
  }
 })

.directive('smallWeather', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div id="small-weather" ng-transclude></div>',

    compile: function(element, attr) {
      console.log('SMALL COMPILED');
      return function($scope, $element, $attr) {
      console.log('SMALL LINKED');

      // Delay so we are in the DOM and can calculate sizes
      $timeout(function() {
        var windowHeight = window.innerHeight;
        var thisHeight = $element[0].offsetHeight;
        var headerHeight = document.querySelector('#header').offsetHeight;
        $element[0].style.paddingTop = (windowHeight - thisHeight) + 'px';
        angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'auto');
        $timeout(function() {
          angular.element(document.querySelector('.content')).css('-webkit-overflow-scrolling', 'touch');
        }, 50);
      });
      }
    }
  }
})

.directive('weatherBox', function($timeout) {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    scope: {
      title: '@'
    },
    template: '<div class="weather-box"><h4 class="title">{{title}}</h4><div ng-transclude></div></div>',
    link: function($scope, $element, $attr) {
    }
  }
})
