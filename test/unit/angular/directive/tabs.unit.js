describe('tabs', function() {

  describe('$ionicTabs controller', function() {
    beforeEach(module('ionic'));
    var ctrl, scope, $element;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $element = angular.element('<div>');
      ctrl = $controller('$ionicTabs', {
        $scope: scope,
        $element: $element
      });
    }));

    it('.getTabIndex should return indexOf tab', function() {
      expect(ctrl.selectedIndex()).toBe(-1);
      var tab1 = {}, tab2 = {};
      ctrl.add(tab1);
      ctrl.add(tab2);

      // .add does not automatically select the first anymore
      expect(ctrl.selectedIndex()).toBe(-1);

      ctrl.select(tab1);
      expect(ctrl.selectedIndex()).toBe(0);

      ctrl.select(0);
      expect(ctrl.selectedIndex()).toBe(0);

      ctrl.select(tab2);
      expect(ctrl.selectedIndex()).toBe(1);
      ctrl.deselect(tab2);
      expect(ctrl.selectedIndex()).toBe(-1);
    });

    it('.add should add tab and NOT select if empty, & set historyId', inject(function($ionicHistory) {
      var tab1 = {};
      var tab2 = {};
      spyOn($ionicHistory, 'registerHistory');
      spyOn(ctrl, 'select');

      ctrl.add(tab1);
      ctrl.select(tab1);
      expect($ionicHistory.registerHistory).toHaveBeenCalledWith(tab1);
      expect(ctrl.tabs).toEqual([tab1]);
      expect(ctrl.select).toHaveBeenCalledWith(tab1);

      ctrl.select.reset();
      ctrl.add(tab2);
      expect($ionicHistory.registerHistory).toHaveBeenCalledWith(tab2);
      expect(ctrl.tabs).toEqual([tab1, tab2]);
      expect(ctrl.select).not.toHaveBeenCalled();
    }));

    it('.remove should remove tab and reselect', function() {
      var tab1 = {}, tab2 = {}, tab3 = {};
      ctrl.add(tab1);
      ctrl.add(tab2);
      ctrl.add(tab3);
      ctrl.select(tab1);
      expect(ctrl.selectedTab()).toBe(tab1);

      ctrl.select(tab3);
      expect(ctrl.selectedTab()).toBe(tab3);

      ctrl.remove(tab3);
      expect(ctrl.selectedTab()).toBe(tab2);
      expect(ctrl.tabs.indexOf(tab3)).toBe(-1);
      ctrl.remove(tab1);
      expect(ctrl.selectedTab()).toBe(tab2);
      expect(ctrl.tabs.indexOf(tab1)).toBe(-1);
      ctrl.remove(tab2);
      expect(ctrl.selectedTab()).toBe(null);
      expect(ctrl.tabs.indexOf(tab2)).toBe(-1);
      expect(ctrl.tabs.length).toBe(0);
    });

    it('.deselect should unselect if visible', function() {
      var tab1 = {
        $tabSelected: true,
        onDeselect: jasmine.createSpy('deselect'),
      };
      ctrl.deselect(tab1);
      expect(tab1.$tabSelected).toBe(false);
      expect(tab1.onDeselect).toHaveBeenCalled();
      expect(ctrl.selectedTab()).toBe(null);
    });

    it('.deselect should do nothing if not visible', function() {
      var tab1 = {
        $tabSelected: false,
        onDeselect: jasmine.createSpy('deselect')
      };
      spyOn(ctrl, 'selectedTab').andCallFake(function() {
        return 'foo';
      });
      ctrl.deselect(tab1);
      expect(tab1.$tabSelected).toBe(false);
      expect(tab1.onDeselect).not.toHaveBeenCalled();
      expect(ctrl.selectedTab()).toBe('foo');
    });

    it('.select should allow number', function() {
      var tab1 = {}, tab2 = {};
      ctrl.add(tab1);
      ctrl.add(tab2);

      ctrl.select(tab2);
      expect(ctrl.selectedTab()).toBe(tab2);

      ctrl.select(0);
      expect(ctrl.selectedTab()).toBe(tab1);

      ctrl.select(1);
      expect(ctrl.selectedTab()).toBe(tab2);

      ctrl.select(tab1);
      expect(ctrl.selectedTab()).toBe(tab1);
    });

    it('.select on selected tab should do nothing or go to history root', inject(function($ionicHistory) {
      spyOn($ionicHistory, 'goToHistoryRoot');
      var tab = { $historyId: '1' };
      ctrl.add(tab);
      ctrl.select(tab);
      expect(ctrl.selectedTab()).toBe(tab);

      //Do nothing unless emit event is passed
      ctrl.select(tab);
      expect($ionicHistory.goToHistoryRoot).not.toHaveBeenCalled();

      ctrl.select(tab, true);
      expect($ionicHistory.goToHistoryRoot).toHaveBeenCalledWith(tab.$historyId);
    }));

    it('.select should deselect all other tabs and set selected', function() {
      var tab1 = {}, tab2 = {
        onSelect: jasmine.createSpy('select')
      };
      ctrl.add(tab1);
      ctrl.add(tab2);
      spyOn(ctrl, 'deselect');

      ctrl.select(tab2);
      expect(ctrl.deselect).toHaveBeenCalledWith(tab1);
      expect(ctrl.deselect).toHaveBeenCalledWith(tab2);

      expect(tab2.$tabSelected).toBe(true);
      expect(ctrl.selectedTab()).toBe(tab2);
      expect(tab2.onSelect).toHaveBeenCalled();
    });

    it('.select with true should emit event', function() {
      var tab1 = {};
      var tab2 = {};
      var tab3 = {
        navViewName: 'viewName',
        hasNavView: true,
        title: 'Super Tab',
        url: 'ionicframework.com',
        uiSref: 'drifty'
      };
      var eName, eData;
      spyOn(scope, '$emit').andCallFake(function(eventName, data) {
        eName = eventName;
        eData = data;
      });
      ctrl.add(tab1);
      ctrl.add(tab2);
      ctrl.add(tab3);

      ctrl.select(tab2);
      expect(scope.$emit).not.toHaveBeenCalled();
      ctrl.select(tab3, true);
      expect(scope.$emit).toHaveBeenCalled();
      expect(eName).toBe('$ionicHistory.change');
      expect(eData).toEqual({
        type: 'tab',
        tabIndex: 2,
        historyId: tab3.$historyId,
        navViewName: tab3.navViewName,
        hasNavView: tab3.hasNavView,
        title: tab3.title,
        url: tab3.href,
        uiSref: tab3.uiSref
      });
    });

    it('.showBar with true/false should remove/add a tabs-item-hide class', function() {
      var visible = ctrl.showBar();
      expect(visible).toBe(true);
      visible = ctrl.showBar(false);
      expect(visible).toBe(false);
      expect($element.hasClass('tabs-item-hide')).toBe(true);
      visible = ctrl.showBar(true);
      expect(visible).toBe(true);
      expect($element.hasClass('tabs-item-hide')).toBe(false);
    });
  });

  describe('ionTabs directive', function() {
    beforeEach(module('ionic'));
    function setup(attrs, content) {
      var element;
      inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        element = $compile('<ion-tabs ' + (attrs||'') + '>' + (content||'') + '</ion-tabs>')(scope);
        scope.$apply();
      });
      return element;
    }

    it('should register with given handle and deregister on destroy', inject(function($ionicTabsDelegate) {
      var deregisterSpy = jasmine.createSpy('deregister');
      spyOn($ionicTabsDelegate, '_registerInstance').andCallFake(function() {
        return deregisterSpy;
      });
      var el = setup('delegate-handle="banana"');

      expect($ionicTabsDelegate._registerInstance)
        .toHaveBeenCalledWith(el.controller('ionTabs'), 'banana', jasmine.any(Function));

      expect(deregisterSpy).not.toHaveBeenCalled();
      el.scope().$destroy();
      expect(deregisterSpy).toHaveBeenCalled();
    }));


    it('should $hasTabs and $hasTabsTop', function() {
      TestUtil.setPlatform('ios');
      var el = setup();
      var scope = el.scope();
      expect(scope.$hasTabs).toBe(true);
      expect(scope.$hasTabsTop).toBe(false);
      el.addClass('tabs-top');
      scope.$apply();
      expect(scope.$hasTabs).toBe(false);
      expect(scope.$hasTabsTop).toBe(true);
      el.removeClass('tabs-top');
      scope.$apply();
      expect(scope.$hasTabs).toBe(true);
      expect(scope.$hasTabsTop).toBe(false);
    });

    it('should transclude content with same scope', function() {
      var el = setup('', '<div class="content"></div>');
      expect(el[0].querySelector('.tabs .content')).toBeTruthy();
    });

  });

  describe('ionicTab controller', function() {
    beforeEach(module('ionic'));
    function setup(attrs) {
      var ctrl;
      inject(function($controller, $rootScope) {
        ctrl = $controller('$ionicTab', {
          $scope: $rootScope.$new(),
          $attrs: attrs || {}
        });
      });
      return ctrl;
    }

    it('.hrefMatchesState', inject(function($location) {
      spyOn($location, 'path').andReturn('/a/b/c');
      var attr = {};
      var ctrl = setup(attr);

      expect(ctrl.hrefMatchesState()).toBeFalsy();

      attr.href = 'a';
      expect(ctrl.hrefMatchesState()).toBe(false);

      attr.href = '/a';
      expect(ctrl.hrefMatchesState()).toBe(true);

      attr.href = '#/a';
      expect(ctrl.hrefMatchesState()).toBe(true);

      attr.href = '#/a/b/c';
      expect(ctrl.hrefMatchesState()).toBe(true);

      attr.href = '#/a/b/c/';
      expect(ctrl.hrefMatchesState()).toBe(true);

      attr.href = '/a/b/c/';
      expect(ctrl.hrefMatchesState()).toBe(true);

      attr.href = '/a/b/c/d';
      expect(ctrl.hrefMatchesState()).toBe(false);

      attr.href = 'something';
      expect(ctrl.hrefMatchesState()).toBe(false);
    }));

    it('.srefMatchesState', inject(function($state) {
      spyOn($state, 'includes').andReturn(111);
      var attr = {};
      var ctrl = setup(attr);

      expect(ctrl.srefMatchesState()).toBeFalsy();
      expect($state.includes).not.toHaveBeenCalled();

      //We won't unit test $state.includes, only that it was called
      attr.uiSref = 'abc';
      expect(ctrl.srefMatchesState()).toBe(111);
      expect($state.includes).toHaveBeenCalledWith('abc');

      $state.includes.reset();
      attr.uiSref = 'def({ param: "value" })';
      ctrl.srefMatchesState();
      expect($state.includes).toHaveBeenCalledWith('def');
    }));

    it('.navNameMatchesState', inject(function($ionicHistory) {
      spyOn($ionicHistory, 'isCurrentStateNavView').andReturn(123);

      var ctrl = setup();
      expect(ctrl.navNameMatchesState()).toBeFalsy();

      ctrl.navViewName = 'foo';
      expect(ctrl.navNameMatchesState()).toBe(123);
      expect($ionicHistory.isCurrentStateNavView).toHaveBeenCalledWith('foo');
    }));
  });

  describe('ionTab directive', function() {
    var tabDoesMatch;
    beforeEach(module('ionic', function($controllerProvider) {
      $controllerProvider.register('$ionicTab', function($scope) {
        this.$scope = $scope;
        this.tabMatchesState = jasmine.createSpy('tabMatchesState')
          .andCallFake(function() {
            return tabDoesMatch;
          });
      });
    }));

    var tabsCtrl, tabsEl, scope, tabEl;
    function setup(attrs, content) {
      inject(function($compile, $rootScope) {
        tabsEl = angular.element(
          '<ion-tabs>' +
            '<ion-tab '+(attrs||'')+'>'+(content||'')+'</ion-tab>' +
          '</ion-tabs>'
        );
        tabEl = tabsEl.find('ion-tab');

        $compile(tabsEl)($rootScope.$new());
        $rootScope.$apply();

        tabsCtrl = tabsEl.data('$ionTabsController');
        scope = tabsEl.scope();

        spyOn(tabsCtrl, 'remove');
      });
    }

    it('should not initially compile content until selected', inject(function($compile, $rootScope) {
      var el = $compile('<ion-tabs>' +
        '<ion-tab></ion-tab>' +
        '<ion-tab><div ng-init="$root.elephant = \'banana\'"></div></ion-tab>' +
      '</ion-tabs>')($rootScope);
      $rootScope.$apply();
      expect($rootScope.elephant).toBeUndefined();
      el.controller('ionTabs').select(1);
      $rootScope.$apply();
      expect($rootScope.elephant).toBe('banana');
    }));

    it('should wrap multiple child elements in a tab with one pane element', inject(function($compile, $rootScope) {
      var el = $compile('<ion-tabs>' +
        '<ion-tab><div>div1</div><div>div2</div></ion-tab>' +
      '</ion-tabs>')($rootScope);
      $rootScope.$apply();

      expect(el[0].querySelector('.tab-content').children.length).toEqual(2);
      expect(el[0].querySelector('.tab-content').classList.contains('pane')).toEqual(true);
      expect(el[0].querySelector('.tab-content').children[0].innerHTML).toEqual('div1');
      expect(el[0].querySelector('.tab-content').children[1].innerHTML).toEqual('div2');
    }));

    it('should add pane and tab-content class to tab w/ one element', inject(function($compile, $rootScope) {
      var el = $compile('<ion-tabs>' +
        '<ion-tab><div>div1</div></ion-tab>' +
      '</ion-tabs>')($rootScope);
      $rootScope.$apply();

      expect(el[0].querySelector('.tab-content').children.length).toEqual(0);
      expect(el[0].querySelector('.tab-content').classList.contains('pane')).toEqual(true);
    }));

    it('should add itself to tabsCtrl and remove on $destroy', function() {
      setup();
      var tab = tabsCtrl.tabs[0];
      tab.$destroy();
      expect(tabsCtrl.remove).toHaveBeenCalledWith(tab);
    });

    it('should compile a <ion-tab-nav> with all of the relevant attrs', function() {
      setup('title="{{a}}" icon-on="{{b}}" icon-off="{{c}}" badge="d" badge-style="{{e}}" class="{{f}}" ng-click="click" hidden="{{g}}" disabled="h"');
      angular.extend(tabEl.scope(), {
        a: 'title',
        b: 'on',
        c: 'off',
        d: 6,
        e: 'badger',
        f: 'someClass',
        g: true,
        h: true
      });
      tabEl.scope().$apply();
      var navItem = angular.element(tabsEl[0].querySelector('.tab-item'));
      expect(navItem.isolateScope().title).toEqual('title');
      expect(navItem.isolateScope().iconOn).toEqual('on');
      expect(navItem.isolateScope().iconOff).toEqual('off');
      expect(navItem.isolateScope().badge).toEqual(6);
      expect(navItem.isolateScope().badgeStyle).toEqual('badger');
      expect(navItem[0].className).toMatch(/someClass/);
      expect(navItem.attr('ng-click')).toEqual('click');
      expect(navItem.isolateScope().hidden).toEqual('true');
      expect(navItem.isolateScope().disabled()).toEqual(true);

      angular.extend(tabEl.scope(), {
        a: 'title2',
        b: 'on2',
        c: 'off2',
        d: 7,
        e: 'badger2',
        f: 'someClass2',
        g: false,
        h: false
      });
      tabEl.scope().$apply();
      expect(navItem.isolateScope().title).toEqual('title2');
      expect(navItem.isolateScope().iconOn).toEqual('on2');
      expect(navItem.isolateScope().iconOff).toEqual('off2');
      expect(navItem.isolateScope().badge).toEqual(7);
      expect(navItem.isolateScope().badgeStyle).toEqual('badger2');
      expect(navItem[0].className).toMatch(/someClass2/);
      expect(navItem.isolateScope().hidden).toEqual('false');
      expect(navItem.isolateScope().disabled()).toEqual(false);

      expect(navItem.parent()[0]).toBe(tabsCtrl.$tabsElement[0]);
    });

    it('should remove <ion-tab-nav> on $destroy', function() {
      setup();
      var navItem = angular.element(tabsEl[0].querySelector('.tab-item'));
      var navItemScope = navItem.isolateScope();
      spyOn(navItemScope, '$destroy');

      tabsCtrl.tabs[0].$destroy();
      expect(navItemScope.$destroy).toHaveBeenCalled();
      expect(navItem.parent().length).toBe(0);
    });

    it('should not set navViewName by default', function() {
      setup();
      expect(tabEl.controller('ionTab').navViewName).toBeUndefined();
    });

    it('should set navViewName if a child ion-nav-view', inject(function($ionicHistory, $rootScope) {
      setup('', '<ion-nav-view name="banana"></ion-nav-view>');
      spyOn(tabsCtrl, 'select');
      var tab = tabsCtrl.tabs[0];

      expect(tabEl.controller('ionTab').navViewName).toBe('banana');
    }));

    it('should call tabMatchesState on compile and if match select', function() {
      setup();
      expect(tabEl.controller('ionTab').tabMatchesState).toHaveBeenCalled();

      tabDoesMatch = true;
      setup();
      expect(tabEl.controller('ionTab').tabMatchesState).toHaveBeenCalled();
    });

    it('should call selectIfMatchesState on $stateChangeSuccess', function() {
      setup('', '<ion-nav-view name="banana"></ion-nav-view>');
      var tabMatchesState = tabEl.controller('ionTab').tabMatchesState;

      tabMatchesState.reset();
      spyOn(tabsCtrl, 'select');
      tabDoesMatch = false;

      tabEl.scope().$broadcast('$stateChangeSuccess');
      expect(tabMatchesState).toHaveBeenCalled();
      expect(tabsCtrl.select).not.toHaveBeenCalled();

      tabMatchesState.reset();
      tabDoesMatch = true;

      tabEl.scope().$broadcast('$stateChangeSuccess');
      expect(tabMatchesState).toHaveBeenCalled();
      expect(tabsCtrl.select).toHaveBeenCalledWith(tabEl.scope(), false);
    });

    it('should transclude on $tabSelected=true', function() {
      setup('', '<div class="inside-content"></div>');
      var tab = tabsCtrl.tabs[0];
      tabsCtrl.deselect(tab);
      tab.$apply();

      spyOn(tab, '$broadcast');

      var tabContent = tabsEl.find('.inside-content');
      expect(tabContent.length).toBe(1);
      expect(tabContent.attr('nav-view')).toBe('cached');

      tab.$apply('$tabSelected = true');

      tabContent = tabsEl.find('.inside-content');
      expect(tabContent.parent()[0]).toBe(tabsCtrl.$element[0]);
      var contentScope = tabContent.scope();
      expect(tabContent.length).toBe(1);

      spyOn(tabContent, 'remove');
      spyOn(contentScope, '$destroy');
      tab.$broadcast.reset();

      tab.$apply('$tabSelected = false');
      expect(tabContent.attr('nav-view')).toBe('cached');
    });

  });

  describe('ionTabNav directive', function() {
    beforeEach(module('ionic'));
    var tabsCtrl, tabCtrl;
    function setup(attrs) {
      tabsCtrl = {
        select: jasmine.createSpy('select'),
        _selectedTab: null,
        selectedTab: function() {
          return this._selectedTab;
        }
      };
      tabCtrl = {
        $scope: {}
      };
      var element;
      inject(function($compile, $rootScope) {
        var scope = $rootScope.$new();
        element = angular.element('<ion-tab-nav ' + (attrs||'') + '></ion-tab-nav>');
        element.data('$ionTabsController', tabsCtrl);
        element.data('$ionTabController', tabCtrl);
        element = $compile(element)(scope);
        scope.$apply();
      });
      return element;
    }

    it('should set tabs css from $ionicConfig', inject(function($rootScope, $compile, $ionicConfig){
      $ionicConfig.tabs.position('top');
      $ionicConfig.tabs.style('striped');
      var scope = $rootScope.$new();
      var element = angular.element('<ion-tabs></ion-tabs>');
      element = $compile(element)(scope);
      expect(element.hasClass('tabs-striped')).toBe(true);
      expect(element.hasClass('tabs-top')).toBe(true);
    }));

    it('should remove title attribute', function() {
      var el = setup('title="something"');
      expect(el[0].hasAttribute('title')).toBe(false);
      expect(el.isolateScope().title).toBe('something');
    });

    // These next two are REALLY specific unit tests,
    // but also are really really vital pieces of code
    it('.isTabActive should be correct', function() {
      var el = setup();
      expect(el.isolateScope().isTabActive()).toBe(false);
      tabsCtrl._selectedTab = tabCtrl.$scope;
      expect(el.isolateScope().isTabActive()).toBe(true);
      tabsCtrl._selectedTab = null;
      expect(el.isolateScope().isTabActive()).toBe(false);
    });
    it('.selectTab should be correct and preventDefault', function() {
      var el = setup();
      var preventSpy = jasmine.createSpy('preventDefault');
      el.isolateScope().selectTab({
        preventDefault: preventSpy
      });
      expect(preventSpy).toHaveBeenCalled();
      expect(tabsCtrl.select).toHaveBeenCalledWith(tabCtrl.$scope, true);
    });

    it('should fallback to icon for icon-on and icon-off', function() {
      var el = setup('icon=1');

      expect(el.isolateScope().getIconOn()).toBe('1');
      el.isolateScope().iconOn = 2;
      expect(el.isolateScope().getIconOn()).toBe(2);
      el.isolateScope().iconOn = null;
      expect(el.isolateScope().getIconOn()).toBe('1');

      expect(el.isolateScope().getIconOff()).toBe('1');
      el.isolateScope().iconOff = 3;
      expect(el.isolateScope().getIconOff()).toBe(3);
      el.isolateScope().iconOff = null;
      expect(el.isolateScope().getIconOff()).toBe('1');

    });

    it('should select tab on click by default', function() {
      var el = setup();
      el.triggerHandler('click');
      expect(tabsCtrl.select).toHaveBeenCalledWith(tabCtrl.$scope, true);
    });

    it('should use ngClick if defined', function() {
      var el = setup('ng-click="doSomething()"');
      el.scope().doSomething = jasmine.createSpy('doSomething');
      el.triggerHandler('click');
      expect(tabsCtrl.select).not.toHaveBeenCalled();
      expect(el.scope().doSomething).toHaveBeenCalled();
    });

    it('should have title and only title', function() {
      var el = setup('title="<b>hi, {{name}}!</b>"');
      expect(el.find('.tab-title').html()).toBe('<b>hi, !</b>');
      expect(el.find('.icon.on').length).toBe(0);
      expect(el.find('.icon.off').length).toBe(0);

      el.scope().$apply('name = "joe"');
      expect(el.find('.tab-title').html()).toBe('<b>hi, joe!</b>');
    });

    it('should change icon class with just icon', function() {
      //In this case, icon-on and icon-off should be same
      var el = setup('icon={{icon}}');
      el.scope().icon="superIcon";
      el.scope().$apply();

      el.isolateScope().isTabActive = function() { return true; };
      el.isolateScope().$apply();

      expect(el.find('.icon.superIcon').length).toBe(1);
      el.isolateScope().isTabActive = function() { return false; };
      el.isolateScope().$apply();

      expect(el.find('.icon.superIcon').length).toBe(1);
    });

    it('should change classes based on active', function() {
      var el = setup('icon-on="{{true}}" icon-off="{{false}}"');

      tabsCtrl.selectedTab = function(){
          return tabCtrl.$scope;
      }
      el.isolateScope().$apply();
      el.isolateScope().$broadcast("tabSelected", {});
      expect(el.hasClass('tab-item-active')).toBe(true);
      expect(el.find('.icon.true').length).toBe(1);
      expect(el.find('.icon.false').length).toBe(0);

      tabsCtrl.selectedTab = function(){
          return "somenthing that isn't the selected tab";
      }
      el.isolateScope().isTabActive = function() { return false; };
      el.isolateScope().$apply();
      el.isolateScope().$broadcast("tabSelected", {});
      expect(el.hasClass('tab-item-active')).toBe(false);
      expect(el.find('.icon.true').length).toBe(0);
      expect(el.find('.icon.false').length).toBe(1);
    });

    it('shouldnt has-badge without badge', function() {
      var el = setup();
      expect(el.hasClass('has-badge')).toBe(false);
      expect(el.find('.badge').length).toBe(0);
    });

    it('should have badge', function() {
      var el = setup('badge="\'badger\'" badge-style="super-style"');
      expect(el.hasClass('has-badge')).toBe(true);
      expect(el.find('.badge.super-style').text()).toBe('badger');
    });
  });
});
