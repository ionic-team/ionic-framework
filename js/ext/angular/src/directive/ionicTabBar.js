angular.module('ionic.ui.tabs', ['ionic.service.view'])

/**
 * @description
 *
 * The Tab Controller renders a set of pages that switch based on taps
 * on a tab bar. Modelled off of UITabBarController.
 */

.directive('tabs', [function() {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    transclude: true,
    controller: ['$scope', '$element', function($scope, $element) {
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

      this.select = function(tabIndex, emitChange) {
        if(tabIndex !== $scope.selectedIndex) {

          $scope.selectedIndex = tabIndex;
          $scope.activeAnimation = $scope.animation;
          _this.selectController(tabIndex);

          var viewData = {
            type: 'tab',
            typeIndex: tabIndex
          };

          for(var x=0; x<this.controllers.length; x++) {
            if(tabIndex === this.controllers[x].tabIndex) {
              viewData.title = this.controllers[x].title;
              viewData.historyId = this.controllers[x].$historyId;
              viewData.url = this.controllers[x].url;
              viewData.uiSref = this.controllers[x].viewSref;
              viewData.uiViewName = this.controllers[x].uiViewName;
              viewData.hasUiView = this.controllers[x].hasUiView;
              break;
            }
          }
          if(emitChange) {
            $scope.$emit('viewState.changeHistory', viewData);
          }
        }
      };

      $scope.controllers = this.controllers;

      $scope.tabsController = this;

    }],
    
    template: '<div class="view"><tab-controller-bar></tab-controller-bar></div>',

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
          //$element.removeClass($scope.animation + ' ' + $scope.animation + '-reverse');
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
.directive('tab', ['ViewService', '$rootScope', '$animate', '$parse', function(ViewService, $rootScope, $animate, $parse) {
  return {
    restrict: 'E',
    require: '^tabs',
    scope: true,
    transclude: 'element',
    compile: function(element, attr, transclude) {

      return function link($scope, $element, $attr, tabsCtrl) {
        var childScope, childElement;

        ViewService.registerHistory($scope);

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

        $scope.$watch('isVisible', function(value) {
          if(childElement) {
            $animate.leave(childElement);
            $scope.$broadcast('tab.hidden');
            childElement = undefined;
          }
          if(childScope) {
            childScope.$destroy();
            childScope = undefined;
          }
          if(value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              childElement = clone;

              clone.addClass('pane');

              $animate.enter(clone, $element.parent(), $element);

              $scope.$broadcast('tab.shown');
            });
          }
        });

        // check if it has a ui-view in it
        transclude($scope.$new(), function(clone) {
          var uiViewEle = clone[0].querySelector('[ui-view]');
          $scope.hasUiView = (uiViewEle !== null);
          if($scope.hasUiView) {
            // this tab has a ui-view
            $scope.uiViewName = uiViewEle.getAttribute('ui-view');
            if( ViewService.isCurrentStateUiView( $scope.uiViewName ) ) {
              // this tab's ui-view is the current one, go to it!
              tabsCtrl.select($scope.tabIndex);
            }
          }
        });

        $rootScope.$on('$stateChangeSuccess', function(value){
          if( ViewService.isCurrentStateUiView($scope.uiViewName) &&
              $scope.tabIndex !== tabsCtrl.selectedIndex) {
            tabsCtrl.select($scope.tabIndex);
          }
        });

      };
    }
  };
}])


.directive('tabControllerBar', function() {
  return {
    restrict: 'E',
    require: '^tabs',
    transclude: true,
    replace: true,
    scope: true,
    template: '<div class="tabs">' + 
      '<tab-controller-item icon-title="{{c.title}}" icon="{{c.icon}}" icon-on="{{c.iconOn}}" icon-off="{{c.iconOff}}" active="c.isVisible" index="$index" ng-repeat="c in controllers"></tab-controller-item>' + 
    '</div>',
    link: function($scope, $element, $attr, tabsCtrl) {
      $element.addClass($scope.tabsType);
      $element.addClass($scope.tabsStyle);
    }
  };
})

.directive('tabControllerItem', ['$window', function($window) {
  return {
    restrict: 'E',
    replace: true,
    require: '^tabs',
    scope: {
      iconTitle: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
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
      '<a ng-class="{active:active}" ng-click="selectTab()" class="tab-item">' +
        '<i class="icon {{icon}}" ng-if="icon"></i>' +
        '<i class="{{iconOn}}" ng-if="active"></i>' +
        '<i class="{{iconOff}}" ng-if="!active"></i> {{iconTitle}}' +
      '</a>'
  };
}])

.directive('tabBar', function() {
  return {
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<div class="tabs tabs-primary" ng-transclude></div>'
  };
});

