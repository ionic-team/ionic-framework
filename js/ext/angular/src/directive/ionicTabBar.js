angular.module('ionic.ui.tabs', ['ionic.service.view'])

/**
 * @description
 *
 * The Tab Controller renders a set of pages that switch based on taps
 * on a tab bar. Modelled off of UITabBarController.
 */

.run(['$ionicViewService', function($ionicViewService) {
  // set that the tabs directive should not animate when transitioning
  // to it. Instead, the children <tab> directives would animate
  $ionicViewService.disableRegisterByTagName('ion-tabs');
}])

.controller('$ionicTabs', ['$scope', '$ionicViewService', '$element', function($scope, $ionicViewService, $element) {
  var self = $scope.tabsController = this;
  self.tabs = $scope.tabs = [];
  self.selectedTab = null;

  self.add = function(tab) {
    $ionicViewService.registerHistory(tab);
    self.tabs.push(tab);
    if(self.tabs.length === 1) {
      self.select(tab);
    }
  };

  self.remove = function(tab) {
    var tabIndex = self.tabs.indexOf(tab);
    if (tabIndex === -1) {
      return;
    }
    //Use a field like '$tabSelected' so developers won't accidentally set it in controllers etc
    if (tab.$tabSelected) { 
      self.deselect(tab);
      //Try to select a new tab if we're removing a tab
      if (self.tabs.length === 1) {
        //do nothing if there are no other tabs to select
      } else {
        //Select previous tab if it's the last tab, else select next tab
        var newTabIndex = tabIndex === self.tabs.length - 1 ? tabIndex - 1 : tabIndex + 1;
        self.select(self.tabs[newTabIndex]);
      }
    }
    self.tabs.splice(tabIndex, 1);
  };

  self.deselect = function(tab) {
    if (tab.$tabSelected) {
      self.selectedTab = null;
      tab.$tabSelected = false;
      (tab.onDeselect || angular.noop)();
    }
  };

  self.select = function(tab, shouldEmitEvent) {
    var tabIndex = self.tabs.indexOf(tab);
    if (tabIndex === -1) {
      throw new Error("Cannot select tab that is not added!");
    }

    if (self.selectedTab && self.selectedTab.$historyId == tab.$historyId) {
      if (shouldEmitEvent) {
        $ionicViewService.goToHistoryRoot(tab.$historyId);
      }
    } else {
      angular.forEach(self.tabs, function(tab) {
        self.deselect(tab);
      });

      self.selectedTab = tab;
      tab.$tabSelected = true;
      (tab.onSelect || angular.noop)();

      if (shouldEmitEvent) {
        var viewData = {
          type: 'tab',
          tabIndex: tabIndex,
          historyId: tab.$historyId,
          navViewName: tab.navViewName,
          hasNavView: !!tab.navViewName,
          title: tab.title,
          //Skip the first character of href if it's #
          url: tab.href,
          uiSref: tab.uiSref
        };
        $scope.$emit('viewState.changeHistory', viewData);
      }
    }
  };
}])

.directive('ionTabs', ['$ionicViewService', '$ionicBind', function($ionicViewService, $ionicBind) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    transclude: true,
    controller: '$ionicTabs',
    template:
    '<div class="view {{$animation}}">' +
      '<div class="tabs {{$tabsStyle}} {{$tabsType}}">' +
      '</div>' +
    '</div>',
    compile: function(element, attr, transclude) {
      if(angular.isUndefined(attr.tabsType)) attr.$set('tabsType', 'tabs-positive');

      return function link($scope, $element, $attr, tabsCtrl) {

        $ionicBind($scope, $attr, {
          $animation: '@animation',
          $tabsStyle: '@tabsStyle',
          $tabsType: '@tabsType'
        });

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = angular.element($element[0].querySelector('.tabs'));

        transclude($scope, function(clone) {
          $element.append(clone);
        });
      };
    }
  };
}])

.controller('$ionicTab', ['$scope', '$ionicViewService', '$rootScope', '$element',
function($scope, $ionicViewService, $rootScope, $element) {
  this.$scope = $scope;
}])

// Generic controller directive
.directive('ionTab', ['$rootScope', '$animate', '$ionicBind', '$compile', '$ionicViewService', function($rootScope, $animate, $ionicBind, $compile, $ionicViewService) {

  //Returns ' key="value"' if value exists
  function attrStr(k,v) {
    return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
  }
  return {
    restrict: 'E',
    require: ['^ionTabs', 'ionTab'],
    replace: true,
    transclude: 'element',
    controller: '$ionicTab',
    scope: true,
    compile: function(element, attr, transclude) {
      return function link($scope, $element, $attr, ctrls) {
        var childScope, childElement, tabNavElement;
          tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        $ionicBind($scope, $attr, {
          animate: '=',
          leftButtons: '=',
          rightButtons: '=',
          onSelect: '&',
          onDeselect: '&',
          title: '@',
          uiSref: '@',
          href: '@',
        });

        tabNavElement = angular.element(
          '<ion-tab-nav ' +
          attrStr('title', attr.title) +
          attrStr('icon', attr.icon) +
          attrStr('icon-on', attr.iconOn) +
          attrStr('icon-off', attr.iconOff) +
          attrStr('ui-sref', attr.uiSref) +
          attrStr('href', attr.href) +
          attrStr('badge', attr.badge) +
          attrStr('badge-style', attr.badgeStyle) +
          '></ion-tab-nav>'
        );
        tabNavElement.data('$ionTabsController', tabsCtrl);
        tabNavElement.data('$ionTabController', tabCtrl);
        tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));

        tabsCtrl.add($scope);
        $scope.$on('$destroy', function() {
          tabsCtrl.remove($scope);
          tabNavElement.isolateScope().$destroy();
          tabNavElement.remove();
        });

        $scope.$watch('$tabSelected', function(value) {
          if (!value) {
            $scope.$broadcast('tab.hidden', $scope);
          }
          childScope && childScope.$destroy();
          childScope = null;
          childElement && $animate.leave(childElement);
          childElement = null;
          if (value) {
            childScope = $scope.$new();
            transclude(childScope, function(clone) {
              //remove title attr to stop hover annoyance!
              clone[0].removeAttribute('title');
              $animate.enter(clone, tabsCtrl.$element);
              clone.addClass('pane');
              childElement = clone;
            });
            $scope.$broadcast('tab.shown', $scope);
          }
        });

        transclude($scope, function(clone) {
          var navView = clone[0].querySelector('ion-nav-view');
          if (navView) {
            $scope.navViewName = navView.getAttribute('name');
            selectTabIfMatchesState();
            $scope.$on('$stateChangeSuccess', selectTabIfMatchesState);
          }
        });

        function selectTabIfMatchesState() {
          // this tab's ui-view is the current one, go to it!
          if ($ionicViewService.isCurrentStateNavView($scope.navViewName)) {
            tabsCtrl.select($scope);
          }
        }
      };
    }
  };
}])

.directive('ionTabNav', function() {
  return {
    restrict: 'E',
    replace: true,
    require: ['^ionTabs', '^ionTab'],
    template:
    '<div ng-class="{active: isTabActive(), \'has-badge\':badge}" ' +
      'ng-click="selectTab()" class="tab-item">' +
      '<span class="badge {{badgeStyle}}" ng-show="badge">{{badge}}</span>' +
      '<i class="icon {{iconOn}}" ng-show="isTabActive()"></i>' +
      '<i class="icon {{iconOff}}" ng-hide="isTabActive()"></i>' +
      '<span class="tab-title" ng-bind-html="title"></span>' +
    '</div>',
    scope: {
      title: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      uiSref: '@',
      href: '@',
      badge: '=',
      badgeStyle: '@'
    },
    compile: function(element, attr, transclude) {
      if (attr.icon) {
        attr.$set('iconOn', attr.icon);
        attr.$set('iconOff', attr.icon);
      }
      return function link($scope, $element, $attrs, ctrls) {
        var tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        $scope.isTabActive = function() {
          return tabCtrl.$scope.$tabSelected;
        };
        $scope.selectTab = function() {
          tabsCtrl.select(tabCtrl.$scope, true);
        };
      };
    }
  };
});
