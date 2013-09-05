angular.module('ionic.ui.tabbar', {})

.controller('TabBarCtrl', ['$scope', '$element', function($scope, $element) {
  var tabs = $scope.tabs = [];

  
  $scope.selectTab = function(index) {
  };
  $scope.beforeTabSelect = function(index) {
  };
  $scope.tabSelected = function(index) {
  };

  this.addTab = function(tab) {
    tabs.push(tab);
  };

  this.getSelectedTabIndex = function() {
    return $scope.selectedIndex;
  };

  this.selectTabAtIndex = function(index) {
    $scope.selectedIndex = index;
  };

  this.getNumTabs = function() {
    return tabs.length;
  };
}])

.directive('tabBar', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {},
    transclude: true,
    controller: 'TabBarCtrl',
    //templateUrl: 'ext/angular/tmpl/ionicTabBar.tmpl.html',
    template: '<div class="view-wrapper" ng-transclude></div>',
  }
})

.directive('tabs', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabBar',
    transclude: true,
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
    require: '^tabBar',
    scope: {
      text: '@',
      icon: '@',
      tabSelected: '@'
    },
    link: function(scope, element, attrs, tabBar) {
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

