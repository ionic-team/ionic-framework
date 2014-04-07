angular.module('ionic.ui.tabs', ['ionic.service.view'])

.run(['$ionicViewService', function($ionicViewService) {
  // set that the tabs directive should not animate when transitioning
  // to it. Instead, the children <tab> directives would animate
  $ionicViewService.disableRegisterByTagName('ion-tabs');
}])

/**
 * @ngdoc service
 * @name $ionicTabsDelegate
 * @module ionic
 *
 * @description
 * Delegate for controlling the {@link ionic.directive:ionTabs} directive.
 *
 * Methods called directly on the $ionicTabsDelegate service will control all ionTabs
 * directives. Use the {@link ionic.service:$ionicTabsDelegate#$getByHandle $getByHandle}
 * method to control specific ionTabs instances.
 *
 * @usage
 *
 * ```html
 * <body ng-controller="MyCtrl">
 *   <ion-tabs>
 *
 *     <ion-tab title="Tab 1">
 *       Hello tab 1!
 *       <button ng-click="selectTabWithIndex(1)">Select tab 2!</button>
 *     </ion-tab>
 *     <ion-tab title="Tab 2">Hello tab 2!</ion-tab>
 *
 *   </ion-tabs>
 * </body>
 * ```
 * ```js
 * function MyCtrl($scope, $ionicTabsDelegate) {
 *   $scope.selectTabWithIndex = function(index) {
 *     $ionicTabsDelegate.select(index);
 *   }
 * }
 * ```
 */
.service('$ionicTabsDelegate', delegateService([
  /**
   * @ngdoc method
   * @name $ionicTabsDelegate#select
   * @description Select the tab matching the given index.
   *
   * @param {number} index Index of the tab to select.
   * @param {boolean=} shouldChangeHistory Whether this selection should load this tab's
   * view history (if it exists) and use it, or just load the default page.
   * Default false.
   * Hint: you probably want this to be true if you have an
   * {@link ionic.directive:ionNavView} inside your tab.
   */
  'select',
  /**
   * @ngdoc method
   * @name $ionicTabsDelegate#selectedIndex
   * @returns `number` The index of the selected tab, or -1.
   */
  'selectedIndex'
  /**
   * @ngdoc method
   * @name $ionicTabsDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link ionic.directive:ionTabs} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$ionicTabsDelegate.$getByHandle('my-handle').select(0);`
   */
]))

.controller('ionicTabs', ['$scope', '$ionicViewService', '$element', function($scope, $ionicViewService, $element) {
  var _selectedTab = null;
  var self = this;
  self.tabs = [];

  self.selectedIndex = function() {
    return self.tabs.indexOf(_selectedTab);
  };
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
 * @delegate ionic.service:$ionicTabsDelegate
 * @restrict E
 * @codepen KbrzJ
 *
 * @description
 * Powers a multi-tabbed interface with a Tab Bar and a set of "pages" that can be tabbed
 * through.
 *
 * Assign any [tabs class](/docs/components#tabs) or
 * [animation class](/docs/components#animation) to the element to define
 * its look and feel.
 *
 * See the {@link ionic.directive:ionTab} directive's documentation for more details on
 * individual tabs.
 *
 * @usage
 * ```html
 * <ion-tabs class="tabs-positive tabs-icon-only">
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
 *
 * </ion-tabs>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify these tabs
 * with {@link ionic.service:$ionicTabsDelegate}.
 */

.directive('ionTabs', ['$ionicViewService', '$ionicTabsDelegate', function($ionicViewService, $ionicTabsDelegate) {
  return {
    restrict: 'E',
    scope: true,
    controller: 'ionicTabs',
    compile: function(element, attr) {
      element.addClass('view');
      //We cannot use regular transclude here because it breaks element.data()
      //inheritance on compile
      var innerElement = angular.element('<div class="tabs"></div>');
      innerElement.append(element.contents());
      element.append(innerElement);

      return { pre: prelink };
      function prelink($scope, $element, $attr, tabsCtrl) {
        var deregisterInstance = $ionicTabsDelegate._registerInstance(
          tabsCtrl, $attr.delegateHandle
        );

        $scope.$on('$destroy', deregisterInstance);

        tabsCtrl.$scope = $scope;
        tabsCtrl.$element = $element;
        tabsCtrl.$tabsElement = angular.element($element[0].querySelector('.tabs'));

        var el = $element[0];
        $scope.$watch(function() { return el.className; }, function(value) {
          var isTabsTop = value.indexOf('tabs-top') !== -1;
          var isHidden = value.indexOf('tabs-item-hide') !== -1;
          $scope.$hasTabs = !isTabsTop && !isHidden;
          $scope.$hasTabsTop = isTabsTop && !isHidden;
        });
        $scope.$on('$destroy', function() {
          $scope.$hasTabs = $scope.$hasTabsTop = null;
        });
      }
    }
  };
}])

.controller('ionicTab', ['$scope', '$ionicViewService', '$attrs', '$location', '$state',
function($scope, $ionicViewService, $attrs, $location, $state) {
  this.$scope = $scope;

  //All of these exposed for testing
  this.hrefMatchesState = function() {
    return $attrs.href && $location.path().indexOf(
      $attrs.href.replace(/^#/, '').replace(/\/$/, '')
    ) === 0;
  };
  this.srefMatchesState = function() {
    return $attrs.uiSref && $state.includes( $attrs.uiSref.split('(')[0] );
  };
  this.navNameMatchesState = function() {
    return this.navViewName && $ionicViewService.isCurrentStateNavView(this.navViewName);
  };

  this.tabMatchesState = function() {
    return this.hrefMatchesState() || this.srefMatchesState() || this.navNameMatchesState();
  };
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
 * @param {expression=} ng-click By default, the tab will be selected on click. If ngClick is set, it will not.  You can explicitly switch tabs using {@link ionic.service:$ionicTabsDelegate#select $ionicTabsDelegate.select()}.
 */
.directive('ionTab', ['$rootScope', '$animate', '$ionicBind', '$compile', '$ionicViewService', '$state', '$location',
function($rootScope, $animate, $ionicBind, $compile, $ionicViewService, $state, $location) {

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
      var navView = element[0].querySelector('ion-nav-view') ||
        element[0].querySelector('data-ion-nav-view');
      var navViewName = navView && navView.getAttribute('name');


      //We create the tabNavElement in the compile phase so that the
      //attributes we pass down won't be interpolated yet - we want
      //to pass down the 'raw' versions of the attributes
      var tabNavElement = angular.element(
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

      //Remove the contents of the element so we can compile them later, if tab is selected
      //We don't use regular transclusion because it breaks element inheritance
      var tabContent = angular.element('<div class="pane">')
        .append( element.contents().remove() );

      return function link($scope, $element, $attr, ctrls) {
        var childScope;
        var childElement;
        var tabsCtrl = ctrls[0];
        var tabCtrl = ctrls[1];

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

        //Remove title attribute so browser-tooltip does not apear
        $element[0].removeAttribute('title');

        if (navViewName) {
          tabCtrl.navViewName = navViewName;
        }
        $scope.$on('$stateChangeSuccess', selectIfMatchesState);
        selectIfMatchesState();
        function selectIfMatchesState() {
          if (tabCtrl.tabMatchesState()) {
            tabsCtrl.select($scope);
          }
        }

        tabNavElement.data('$ionTabsController', tabsCtrl);
        tabNavElement.data('$ionTabController', tabCtrl);
        tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));

        $scope.$watch('$tabSelected', function(value) {
          childScope && childScope.$destroy();
          childScope = null;
          childElement && $animate.leave(childElement);
          childElement = null;
          if (value) {
            childScope = $scope.$new();
            childElement = tabContent.clone();
            $animate.enter(childElement, tabsCtrl.$element);
            $compile(childElement)(childScope);
          }
        });

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
    '<a ng-class="{\'tab-item-active\': isTabActive(), \'has-badge\':badge}" ' +
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
