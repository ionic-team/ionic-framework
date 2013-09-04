angular.module('ionic.ui.tabbar', {})

.controller('TabBarCtrl', function($scope) {
  $scope.selectTab = function(index) {
  };
  $scope.beforeTabSelect = function(index) {
  };
  $scope.tabSelected = function(index) {
  };

  this.getSelectedTabIndex = function() {
    return $scope.selectedIndex;
  }

  this.selectTabAtIndex = function(index) {
    $scope.selectedIndex = index;
  };
})

.directive('tabBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    controller: 'TabBarCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="full-section"></div>',
  }
})

.controller('TabsCtrl', function($scope) {
})

.directive('tabs', function() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'TabBarCtrl',
    template: '<footer class="bar bar-tabs bar-footer bar-success">' + 
  '<nav class="tabs">' + 
    '<ul class="tabs-inner">' + 
      '<tab-item ng-repeat="tab in tabs">' + 
      '</tab-item>' +
    '</ul>' +
  '</nav>' +
'</footer>'
  }
})

.directive('tabItem', function() {
  return {
    restrict: 'E',
    replace: true,
    controller: 'TabBarCtrl',
    scope: {
      text: '@',
      icon: '@',
      tabSelected: '@'
    },
    link: function(scope, element, attrs, TabBarCtrl) {
      // Set a default item text if none is provided
      attrs.$observe('text', function(value) {
        scope.text = value || 'Item';
      });
      
      // Set a default item icon if none is provided
      attrs.$observe('icon', function(value) {
        scope.icon = value || 'icon-default';
      });
    },
    template: '<li class="tab-item">' + 
        '<a href="#" ng-click="selectTabItem($index)">' + 
          '<i class="{{icon}}"></i>' +
          '{{text}}' +
        '</a></li>'
  }
});

