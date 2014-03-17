angular.module('ionic.ui.tabs', ['ionic.service.view'])

.run(['$ionicViewService', function($ionicViewService) {
  // set that the tabs directive should not animate when transitioning
  // to it. Instead, the children <tab> directives would animate
  $ionicViewService.disableRegisterByTagName('ion-tabs');
}])

/**
 * @ngdoc controller
 * @name ionicTabs
 * @module ionic
 *
 * @description
 * Controller for the {@link ionic.directive:ionTabs} directive.
 */
.controller('ionicTabs', ['$scope', '$ionicViewService', '$element', function($scope, $ionicViewService, $element) {
  var _selectedTab = null;
  var self = this;
  self.tabs = [];

  /**
   * @ngdoc method
   * @name ionicTabs#selectedTabIndex
   * @returns `number` The index of the selected tab, or -1.
   */
  self.selectedTabIndex = function() {
    return self.tabs.indexOf(_selectedTab);
  };
  /**
   * @ngdoc method
   * @name ionicTabs#selectedTab
   * @returns `ionTab` The selected tab or null if none selected.
   */
  self.selectedTab = function() {
    return _selectedTab;
  };

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
      _selectedTab = null;
      tab.$tabSelected = false;
      (tab.onDeselect || angular.noop)();
    }
  };

  /**
   * @ngdoc method
   * @name ionicTabs#select
   * @description Select the given tab or tab index.
   *
   * @param {ionTab|number} tabOrIndex A tab object or index of a tab to select
   * @param {boolean=} shouldChangeHistory Whether this selection should load this tab's view history
   * (if it exists) and use it, or just loading the default page. Default false.
   * Hint: you probably want this to be true if you have an
   * {@link ionic.directive:ionNavView} inside your tab.
   */
  self.select = function(tab, shouldEmitEvent) {
    var tabIndex;
    if (angular.isNumber(tab)) {
      tabIndex = tab;
      tab = self.tabs[tabIndex];
    } else {
      tabIndex = self.tabs.indexOf(tab);
    }
    if (!tab || tabIndex == -1) {
      throw new Error('Cannot select tab "' + tabIndex + '"!');
    }

    if (_selectedTab && _selectedTab.$historyId == tab.$historyId) {
      if (shouldEmitEvent) {
        $ionicViewService.goToHistoryRoot(tab.$historyId);
      }
    } else {
      angular.forEach(self.tabs, function(tab) {
        self.deselect(tab);
      });

      _selectedTab = tab;
      //Use a funny name like $tabSelected so the developer doesn't overwrite the var in a child scope
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

/**
 * @ngdoc directive
 * @name ionTabs
 * @module ionic
 * @restrict E
 * @controller ionicTabs
 * @codepen KbrzJ
 *
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages" that can be tabbed through.
 *
 * See the {@link ionic.directive:ionTab} directive's documentation for more details.
 *
 * @usage
 * ```html
 * <ion-tabs tabs-type="tabs-icon-only">
 *
 *   <ion-tab title="Home" icon-on="ion-ios7-filing" icon-off="ion-ios7-filing-outline">
 *     <!-- Tab 1 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="About" icon-on="ion-ios7-clock" icon-off="ion-ios7-clock-outline">
 *     <!-- Tab 2 content -->
 *   </ion-tab>
 *
 *   <ion-tab title="Settings" icon-on="ion-ios7-gear" icon-off="ion-ios7-gear-outline">
 *     <!-- Tab 3 content -->
 *   </ion-tab>
 * </ion-tabs>
 * ```
 *
 * @param {expression=} model The model to assign this tab bar's {@link ionic.controller:ionicTabs} controller to. By default, assigns  to $scope.tabsController.
 * @param {string=} animation The animation to use when changing between tab pages.
 * @param {string=} tabs-style The class to apply to the tabs. Defaults to 'tabs-positive'.
 * @param {string=} tabs-type Whether to put the tabs on the top or bottom. Defaults to 'tabs-bottom'.
 */

.directive('ionTabs', ['$ionicViewService', '$ionicBind', '$parse', function($ionicViewService, $ionicBind, $parse) {
  return {
    restrict: 'E',
    replace: true,
    scope: true,
    transclude: true,
    controller: 'ionicTabs',
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

        $parse(attr.model || 'tabsController').assign($scope, tabsCtrl);

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

.controller('ionicTab', ['$scope', '$ionicViewService', '$rootScope', '$element',
function($scope, $ionicViewService, $rootScope, $element) {
  this.$scope = $scope;
}])

/**
 * @ngdoc directive
 * @name ionTab
 * @module ionic
 * @restrict E
 * @parent ionic.directive:ionTabs
 *
 * @description
 * Contains a tab's content.  The content only exists while the given tab is selected.
 *
 * Each ionTab has its own view history.
 *
 * Whenever a tab is shown or hidden, it will broadcast a 'tab.shown' or 'tab.hidden' event.
 *
 * @usage
 * ```html
 * <ion-tab
 *   title="Tab!"
 *   icon="my-icon"
 *   href="#/tab/tab-link"
 *   on-select="onTabSelected()"
 *   on-deselect="onTabDeselected()">
 * </ion-tab>
 * ```
 * For a complete, working tab bar example, see the {@link ionic.directive:ionTabs} documentation.
 *
 * @param {string} title The title of the tab.
 * @param {string=} href The link that this tab will navigate to when tapped.
 * @param {string=} icon The icon of the tab. If given, this will become the default for icon-on and icon-off.
 * @param {string=} icon-on The icon of the tab while it is selected.
 * @param {string=} icon-off The icon of the tab while it is not selected.
 * @param {expression=} badge The badge to put on this tab (usually a number).
 * @param {expression=} badge-style The style of badge to put on this tab (eg tabs-positive).
 * @param {expression=} on-select Called when this tab is selected.
 * @param {expression=} on-deselect Called when this tab is deselected.
 * @param {expression=} ng-click By default, the tab will be selected on click. If ngClick is set, it will not.  You can explicitly switch tabs using {@link ionic.controller:ionicTabs#select ionicTabBar controller's select method}.
 */
.directive('ionTab', ['$rootScope', '$animate', '$ionicBind', '$compile', '$ionicViewService',
function($rootScope, $animate, $ionicBind, $compile, $ionicViewService) {

  //Returns ' key="value"' if value exists
  function attrStr(k,v) {
    return angular.isDefined(v) ? ' ' + k + '="' + v + '"' : '';
  }
  return {
    restrict: 'E',
    require: ['^ionTabs', 'ionTab'],
    replace: true,
    controller: 'ionicTab',
    scope: true,
    compile: function(element, attr) {
      //Do we have a navView?
      var navView = element[0].querySelector('ion-nav-view') ||
        element[0].querySelector('data-ion-nav-view');
      var navViewName = navView && navView.getAttribute('name');

      //Remove the contents of the element so we can compile them later, if tab is selected
      var tabContent = angular.element('<div class="pane">')
        .append( element.contents().remove() );
      return function link($scope, $element, $attr, ctrls) {
        var childScope, childElement, tabNavElement;
          tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        $ionicBind($scope, $attr, {
          animate: '=',
          onSelect: '&',
          onDeselect: '&',
          title: '@',
          uiSref: '@',
          href: '@',
        });

        tabsCtrl.add($scope);
        $scope.$on('$destroy', function() {
          tabsCtrl.remove($scope);
          tabNavElement.isolateScope().$destroy();
          tabNavElement.remove();
        });

        if (navViewName) {
          $scope.navViewName = navViewName;
          $scope.$on('$stateChangeSuccess', selectTabIfMatchesState);
          selectTabIfMatchesState();
        }

        tabNavElement = angular.element(
          '<ion-tab-nav' +
          attrStr('ng-click', attr.ngClick) +
          attrStr('title', attr.title) +
          attrStr('icon', attr.icon) +
          attrStr('icon-on', attr.iconOn) +
          attrStr('icon-off', attr.iconOff) +
          attrStr('badge', attr.badge) +
          attrStr('badge-style', attr.badgeStyle) +
          '></ion-tab-nav>'
        );
        tabNavElement.data('$ionTabsController', tabsCtrl);
        tabNavElement.data('$ionTabController', tabCtrl);
        tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));

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
            childElement = tabContent.clone();
            $animate.enter(childElement, tabsCtrl.$element);
            $compile(childElement)(childScope);
            $scope.$broadcast('tab.shown', $scope);
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

.directive('ionTabNav', ['$ionicNgClick', function($ionicNgClick) {
  return {
    restrict: 'E',
    replace: true,
    require: ['^ionTabs', '^ionTab'],
    template:
    '<a ng-class="{active: isTabActive(), \'has-badge\':badge}" ' +
      ' class="tab-item">' +
      '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' +
      '<i class="icon {{getIconOn()}}" ng-if="getIconOn() && isTabActive()"></i>' +
      '<i class="icon {{getIconOff()}}" ng-if="getIconOff() && !isTabActive()"></i>' +
      '<span class="tab-title" ng-bind-html="title"></span>' +
    '</a>',
    scope: {
      title: '@',
      icon: '@',
      iconOn: '@',
      iconOff: '@',
      badge: '=',
      badgeStyle: '@'
    },
    compile: function(element, attr, transclude) {
      return function link($scope, $element, $attrs, ctrls) {
        var tabsCtrl = ctrls[0],
          tabCtrl = ctrls[1];

        //Remove title attribute so browser-tooltip does not apear
        $element[0].removeAttribute('title');

        $scope.selectTab = function(e) {
          e.preventDefault();
          tabsCtrl.select(tabCtrl.$scope, true);
        };
        if (!$attrs.ngClick) {
          $ionicNgClick($scope, $element, 'selectTab($event)');
        }

        $scope.getIconOn = function() {
          return $scope.iconOn || $scope.icon;
        };
        $scope.getIconOff = function() {
          return $scope.iconOff || $scope.icon;
        };

        $scope.isTabActive = function() {
          return tabsCtrl.selectedTab() === tabCtrl.$scope;
        };
      };
    }
  };
}]);
