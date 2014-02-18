angular.module('ionic.ui.tabs', ['ionic.service.view', 'ionic.ui.bindHtml'])

/**
 * @description
 *
 * The Tab Controller renders a set of pages that switch based on taps
 * on a tab bar. Modelled off of UITabBarController.
 */

.run(['$ionicViewService', function($ionicViewService) {
  // set that the tabs directive should not animate when transitioning
  // to it. Instead, the children <ion-tab> directives would animate
  $ionicViewService.disableRegisterByTagName('tabs');
}])

.controller('$ionicTabs', ['$scope', '$ionicViewService', function($scope, $ionicViewService) {
  var _this = this;

  $scope.tabCount = 0;
  $scope.selectedIndex = -1;
  $scope.$enableViewRegister = false;

  angular.extend(this, ionic.controllers.TabBarController.prototype);

  ionic.controllers.TabBarController.call(this, {
    controllerChanged: function(oldC, oldI, newC, newI) {
      $scope.controllerChanged && $scope.controllerChanged({
        oldController: oldC,
        oldIndex: oldI,
        newController: newC,
        newIndex: newI
      });
    },
    tabBar: {
      tryTabSelect: function() {},
      setSelectedItem: function(index) {},
      addItem: function(item) {}
    }
  });

  this.add = function(tabScope) {
    tabScope.tabIndex = $scope.tabCount;
    this.addController(tabScope);
    if(tabScope.tabIndex === 0) {
      this.select(0);
    }
    $scope.tabCount++;
  };

  function controllerByTabIndex(tabIndex) {
    for (var x=0; x<_this.controllers.length; x++) {
      if (_this.controllers[x].tabIndex === tabIndex) {
        return _this.controllers[x];
      }
    }
  }

  this.select = function(tabIndex, emitChange) {
    if(tabIndex !== $scope.selectedIndex) {

      $scope.selectedIndex = tabIndex;
      $scope.activeAnimation = $scope.animation;
      _this.selectController(tabIndex);

      var viewData = {
        type: 'tab',
        typeIndex: tabIndex
      };

      var tabController = controllerByTabIndex(tabIndex);
      if (tabController) {
        viewData.title = tabController.title;
        viewData.historyId = tabController.$historyId;
        viewData.url = tabController.url;
        viewData.uiSref = tabController.viewSref;
        viewData.navViewName = tabController.navViewName;
        viewData.hasNavView = tabController.hasNavView;
      }

      if(emitChange) {
        $scope.$emit('viewState.changeHistory', viewData);
      }
    } else if(emitChange) {
      var currentView = $ionicViewService.getCurrentView();
      if (currentView) {
        $ionicViewService.goToHistoryRoot(currentView.historyId);
      }
    }
  };

  $scope.controllers = this.controllers;

  $scope.tabsController = this;

}])

.directive('ionTabs', ['$ionicViewService', function($ionicViewService) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    transclude: true,
    controller: '$ionicTabs',
    template: '<div class="view"><ion-tab-controller-bar></ion-tab-controller-bar></div>',
    compile: function(element, attr, transclude, tabsCtrl) {
      return function link($scope, $element, $attr) {

        var tabs = $element[0].querySelector('.tabs');

        $scope.tabsType = $attr.tabsType || 'tabs-positive';
        $scope.tabsStyle = $attr.tabsStyle;
        $scope.animation = $attr.animation;

        $scope.animateNav = $scope.$eval($attr.animateNav);
        if($scope.animateNav !== false) {
          $scope.animateNav = true;
        }

        $attr.$observe('tabsStyle', function(val) {
          if(tabs) {
            angular.element(tabs).addClass($attr.tabsStyle);
          }
        });

        $attr.$observe('tabsType', function(val) {
          if(tabs) {
            angular.element(tabs).addClass($attr.tabsType);
          }
        });

        $scope.$watch('activeAnimation', function(value) {
          $element.addClass($scope.activeAnimation);
        });
        transclude($scope, function(cloned) {
          $element.prepend(cloned);
        });

      };
    }
  };
}])

// Generic controller directive
.directive('ionTab', ['$ionicViewService', '$rootScope', '$parse', '$interpolate', function($ionicViewService, $rootScope, $parse, $interpolate) {
  return {
    restrict: 'E',
    require: '^ionTabs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {

      return function link($scope, $element, $attr, tabsCtrl) {
        var childScope, childElement;

        $ionicViewService.registerHistory($scope);

        $scope.title = $attr.title;
        $scope.icon = $attr.icon;
        $scope.iconOn = $attr.iconOn;
        $scope.iconOff = $attr.iconOff;
        $scope.viewSref = $attr.uiSref;
        $scope.url = $attr.href;
        if($scope.url && $scope.url.indexOf('#') === 0) {
          $scope.url = $scope.url.replace('#', '');
        }

        // Should we hide a back button when this tab is shown
        $scope.hideBackButton = $scope.$eval($attr.hideBackButton);

        if($scope.hideBackButton !== true) {
          $scope.hideBackButton = false;
        }

        // Whether we should animate on tab change, also impacts whether we
        // tell any parent nav controller to animate
        $scope.animate = $scope.$eval($attr.animate);

        var badgeGet = $parse($attr.badge);
        $scope.$watch(badgeGet, function(value) {
          $scope.badge = value;
        });

        $attr.$observe('badgeStyle', function(value) {
          $scope.badgeStyle = value;
        });

        var leftButtonsGet = $parse($attr.leftButtons);
        $scope.$watch(leftButtonsGet, function(value) {
          $scope.leftButtons = value;
          if($scope.doesUpdateNavRouter) {
            $scope.$emit('viewState.leftButtonsChanged', $scope.rightButtons);
          }
        });

        var rightButtonsGet = $parse($attr.rightButtons);
        $scope.$watch(rightButtonsGet, function(value) {
          $scope.rightButtons = value;
        });

        tabsCtrl.add($scope);

        function cleanupChild() {
          if(childElement) {
            childElement.remove();
            childElement = null;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = null;
          }
        }

        $scope.$watch('isVisible', function(value) {
          if (value) {
            cleanupChild();
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              clone.addClass('pane');
              clone.removeAttr('title');
              childElement = clone;
              $element.parent().append(childElement);
            });
            $scope.$broadcast('tab.shown');
          } else if (childScope) {
            $scope.$broadcast('tab.hidden');
            cleanupChild();
          }
        });

        // on link, check if it has a nav-view in it
        transclude($scope.$new(), function(clone) {
          var navViewEle = clone[0].getElementsByTagName("ion-nav-view");
          $scope.hasNavView = (navViewEle.length > 0);
          if($scope.hasNavView) {
            // this tab has a ui-view
            $scope.navViewName = navViewEle[0].getAttribute('name');
            if( $ionicViewService.isCurrentStateNavView( $scope.navViewName ) ) {
              // this tab's ui-view is the current one, go to it!
              tabsCtrl.select($scope.tabIndex);
            }
          }
        });

        var unregister = $rootScope.$on('$stateChangeSuccess', function(value){
          if( $ionicViewService.isCurrentStateNavView($scope.navViewName) &&
              $scope.tabIndex !== tabsCtrl.selectedIndex) {
            tabsCtrl.select($scope.tabIndex);
          }
        });

        $scope.$on('$destroy', unregister);

      };
    }
  };
}])


.directive('ionTabControllerBar', function() {
  return {
    restrict: 'E',
    require: '^ionTabs',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs">' +
      '<ion-tab-controller-item icon-title="{{c.title}}" icon="{{c.icon}}" icon-on="{{c.iconOn}}" icon-off="{{c.iconOff}}" badge="c.badge" badge-style="c.badgeStyle" active="c.isVisible" index="$index" ng-repeat="c in controllers"></ion-tab-controller-item>' +
    '</div>',
    link: function($scope, $element, $attr, tabsCtrl) {
      $element.addClass($scope.tabsType);
      $element.addClass($scope.tabsStyle);
    }
  };
})

.directive('ionTabControllerItem', ['$window', function($window) {
  return {
    restrict: 'E',
    replace: true,
    require: '^ionTabs',
    scope: {
      iconTitle: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      badge: '=',
      badgeStyle: '=',
      active: '=',
      tabSelected: '@',
      index: '='
    },
    link: function(scope, element, attrs, tabsCtrl) {
      if(attrs.icon) {
        scope.iconOn = scope.iconOff = attrs.icon;
      }

      scope.selectTab = function() {
        tabsCtrl.select(scope.index, true);
      };
    },
    template:
      '<a ng-class="{active:active, \'has-badge\':badge}" ng-click="selectTab()" class="tab-item">' +
        '<i class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</i>' +
        '<i class="icon {{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i>' +
        '<span ion-bind-html-unsafe="iconTitle"></span>' +
      '</a>'
  };
}]);

