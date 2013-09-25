angular.module('ionic.ui.content', {})

.directive('content', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="content"></div>'
  }
});
;angular.module('ionic.ui.tabbar', {})

.controller('TabBarCtrl', ['$scope', '$element', function($scope, $element) {
  console.log('Tab controller');
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
    console.log('Scope selected tab is', index);
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
      '<tab-item text="Item" icon="icon-default" ng-repeat="tab in tabs">' + 
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
      active: '=',
      tabSelected: '@',
    },
    compile: function(element, attrs, transclude) {
      return function(scope, element, attrs, tabBarCtrl) {
        var getActive, setActive;

        scope.$watch('active', function(active) {
          console.log('ACTIVE CHANGED', active);
        });
      };
    },
    link: function(scope, element, attrs, tabBarCtrl) {

      // Store the index of this list item, which
      // specifies which tab item it is
      scope.tabIndex = element.index();

      scope.active = true;

      scope.selectTab = function(index) {
        console.log('SELECT TAB', index);
        tabBarCtrl.selectTabAtIndex(index);
      };
      
      tabBarCtrl.addTab(scope);
    },
    template: '<li class="tab-item" ng-class="{active:active}">' + 
        '<a href="#" ng-click="selectTab(tabIndex)">' + 
          '<i class="{{icon}}"></i>' +
          '{{text}}' +
        '</a></li>'
  }
});

