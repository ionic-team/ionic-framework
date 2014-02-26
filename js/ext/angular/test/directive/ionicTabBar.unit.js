ddescribe('tabs', function() {

  describe('miscellaneous', function() {
    beforeEach(module('ionic', function($provide) {
      $provide.value('$ionicViewService', {
        disableRegisterByTagName: jasmine.createSpy('disableRegisterByTagName')
      });
    }));
    it('should register tabs', inject(function($ionicViewService) {
      expect($ionicViewService.disableRegisterByTagName).toHaveBeenCalledWith('ion-tabs');
    }));
  });

  describe('$ionicTabs controller', function() {
    beforeEach(module('ionic'));
    var ctrl, scope;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('$ionicTabs', {
        $scope: scope,
        $element: angular.element('<div>')
      });
    }));

    it('should add itself to scope', function() {
      expect(scope.tabsController).toBe(ctrl);
    });

    it('.getTabIndex should return indexOf tab', function() {
      ctrl.tabs = [1,2];
      expect(ctrl.getTabIndex(1)).toBe(0);
      expect(ctrl.getTabIndex(2)).toBe(1);
      expect(ctrl.getTabIndex(3)).toBe(-1);
    });

    it('.add should add tab and select if empty, & set historyId', inject(function($ionicViewService) {
      var tab1 = {};
      var tab2 = {};
      spyOn($ionicViewService, 'registerHistory');
      spyOn(ctrl, 'select');

      ctrl.add(tab1);
      expect($ionicViewService.registerHistory).toHaveBeenCalledWith(tab1);
      expect(ctrl.tabs).toEqual([tab1]);
      expect(ctrl.select).toHaveBeenCalledWith(tab1);

      ctrl.select.reset();
      ctrl.add(tab2);
      expect($ionicViewService.registerHistory).toHaveBeenCalledWith(tab2);
      expect(ctrl.tabs).toEqual([tab1, tab2]);
      expect(ctrl.select).not.toHaveBeenCalled();
    }));

    it('.remove should remove tab and reselect', function() {
      var tab1 = {}, tab2 = {}, tab3 = {};
      ctrl.add(tab1);
      ctrl.add(tab2);
      ctrl.add(tab3);
      expect(ctrl.selectedTab).toBe(tab1);

      ctrl.select(tab3);
      expect(ctrl.selectedTab).toBe(tab3);

      ctrl.remove(tab3);
      expect(ctrl.selectedTab).toBe(tab2);
      expect(ctrl.tabs.indexOf(tab3)).toBe(-1);
      ctrl.remove(tab1);
      expect(ctrl.selectedTab).toBe(tab2);
      expect(ctrl.tabs.indexOf(tab1)).toBe(-1);
      ctrl.remove(tab2)
      expect(ctrl.selectedTab).toBe(null);
      expect(ctrl.tabs.indexOf(tab2)).toBe(-1);
      expect(ctrl.tabs.length).toBe(0);
    });

    it('.deselect should unselect if visible', function() {
      var tab1 = {
        $tabSelected: true,
        onDeselect: jasmine.createSpy('deselect')
      };
      ctrl.selectedTab = tab1;
      ctrl.deselect(tab1);
      expect(tab1.$tabSelected).toBe(false);
      expect(tab1.onDeselect).toHaveBeenCalled();
      expect(ctrl.selectedTab).toBe(null);
    });

    it('.deselect should do nothing if not visible', function() {
      var tab1 = {
        $tabSelected: false,
        onDeselect: jasmine.createSpy('deselect')
      };
      ctrl.selectedTab = 'foo';
      ctrl.deselect(tab1);
      expect(tab1.$tabSelected).toBe(false);
      expect(tab1.onDeselect).not.toHaveBeenCalled();
      expect(ctrl.selectedTab).toBe('foo');
    });

    it('.select should throw error if tab doesnt exist', function() {
      var tab = {};
      ctrl.add(tab);
      expect(function() {
        ctrl.select({});
      }).toThrow();
      expect(function() {
        ctrl.select(null);
      }).toThrow();
      expect(function() {
        ctrl.select(tab);
      }).not.toThrow();
    });

    it('.select should throw error if number is bad', function() {
      ctrl.add({});
      expect(function() {
        ctrl.select(1);
      }).toThrow();
      expect(function() {
        ctrl.select(-1);
      }).toThrow();
      expect(function() {
        ctrl.select(0);
      }).not.toThrow();
    });

    it('.select should allow number', function() {
      var tab1 = {}, tab2 = {};
      ctrl.add(tab1);
      ctrl.add(tab2);

      ctrl.select(tab2);
      expect(ctrl.selectedTab).toBe(tab2);

      ctrl.select(0);
      expect(ctrl.selectedTab).toBe(tab1);

      ctrl.select(1);
      expect(ctrl.selectedTab).toBe(tab2);

      ctrl.select(tab1);
      expect(ctrl.selectedTab).toBe(tab1);
    });

    it('.select on selected tab should do nothing or go to history root', inject(function($ionicViewService) {
      spyOn($ionicViewService, 'goToHistoryRoot');
      var tab = { $historyId: '1' };
      ctrl.add(tab);
      expect(ctrl.selectedTab).toBe(tab);

      //Do nothing unless emit event is passed
      ctrl.select(tab);
      expect($ionicViewService.goToHistoryRoot).not.toHaveBeenCalled();

      ctrl.select(tab, true);
      expect($ionicViewService.goToHistoryRoot).toHaveBeenCalledWith(tab.$historyId);
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
      expect(ctrl.selectedTab).toBe(tab2);
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
      expect(eName).toBe('viewState.changeHistory');
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

    it('should set attr classes', function() {
      var el = setup('animation="foo" tabs-style="bar" tabs-type="baz"');
      expect(el.hasClass('foo')).toBe(true);
      expect(el.children().hasClass('bar baz')).toBe(true);
    });

    it('should default tabsType to tabs-positive', function() {
      var el = setup();
      expect(el.children().hasClass('tabs-positive')).toBe(true);
    });

    it('should transclude content with same scope', function() {
      var el = setup('', '<div class="content"></div>');
      expect(el.children().eq(1).hasClass('content')).toBe(true);
      expect(el.children().eq(1).scope()).toBe(el.scope());
    });
  });

  describe('ionTab directive', function() {
    beforeEach(module('ionic'));
    var tabsCtrl, tabsEl, scope;
    function setup(attrs, content) {
      inject(function($compile, $rootScope, $injector) {
        tabsEl = angular.element('<ion-tabs><ion-tab '+(attrs||'')+'>'+(content||'')+'</ion-tab></ion-tabs>');

        $compile(tabsEl)($rootScope.$new());
        $rootScope.$apply();

        tabsCtrl = tabsEl.data('$ionTabsController');
        scope = tabsEl.scope();

        spyOn(tabsCtrl, 'remove');
      });
    }

    it('should add itself to tabsCtrl and remove on $destroy', function() {
      var el = setup();
      var tab = tabsCtrl.tabs[0];
      tab.$destroy();
      expect(tabsCtrl.remove).toHaveBeenCalledWith(tab);
    });

    it('should compile a <ion-tab-nav> with all of the relevant attrs', function() {
      setup('title=1 icon-on=2 icon-off=3 badge=4 badge-style=5');
      var navItem = angular.element(tabsEl[0].querySelector('.tab-item'));
      expect(navItem.attr('title')).toEqual('1');
      expect(navItem.attr('icon-on')).toEqual('2');
      expect(navItem.attr('icon-off')).toEqual('3');
      expect(navItem.attr('badge')).toEqual('4');
      expect(navItem.attr('badge-style')).toEqual('5');

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

    it('should not set navViewName if no child nav-view', function() {
      setup();
      expect(tabsCtrl.tabs[0].navViewName).toBeUndefined();
    });

    it('should set navViewName and select when necessary if a child nav-view', inject(function($ionicViewService, $rootScope) {
      var isCurrent = false;
      spyOn($ionicViewService, 'isCurrentStateNavView').andCallFake(function(name) {
        return isCurrent;
      });

      setup('', '<ion-nav-view name="banana"></ion-nav-view>');
      spyOn(tabsCtrl, 'select');
      var tab = tabsCtrl.tabs[0];

      expect(tab.navViewName).toBe('banana');
      expect($ionicViewService.isCurrentStateNavView).toHaveBeenCalledWith('banana');

      $ionicViewService.isCurrentStateNavView.reset();
      isCurrent = true;
      $rootScope.$broadcast('$stateChangeSuccess');

      expect($ionicViewService.isCurrentStateNavView).toHaveBeenCalledWith('banana');
      expect(tabsCtrl.select).toHaveBeenCalledWith(tab);
    }));

    it('should transclude on $tabSelected=true', function() {
      setup('', '<div class="inside-content"></div>');
      var tab = tabsCtrl.tabs[0];
      tabsCtrl.deselect(tab);
      tab.$apply();

      spyOn(tab, '$broadcast');

      var tabContent = tabsEl.find('.pane');
      expect(tabContent.length).toBe(0);

      tab.$apply('$tabSelected = true');

      tabContent = tabsEl.find('.pane');
      expect(tabContent.parent()[0]).toBe(tabsCtrl.$element[0]);
      var contentScope = tabContent.scope();
      expect(tabContent.length).toBe(1);
      expect(tabContent.find('.inside-content').length).toBe(1);
      expect(tab.$broadcast).toHaveBeenCalledWith('tab.shown', tab);

      spyOn(tabContent, 'remove');
      spyOn(contentScope, '$destroy');
      tab.$broadcast.reset();

      tab.$apply('$tabSelected = false');
      expect(tabContent.parent().length).toBe(0); //removed check
      expect(contentScope.$destroy).toHaveBeenCalled();
      expect(tab.$broadcast).toHaveBeenCalledWith('tab.hidden', tab);
    });

  });

  describe('ionTabNav directive', function() {
    beforeEach(module('ionic'));
    var tabsCtrl, tabCtrl;
    function setup(attrs) {
      tabsCtrl = {
        select: jasmine.createSpy('select')
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

    // These next two are REALLY specific unit tests,
    // but also are really really vital pieces of code
    it('.isTabActive should be correct', function() {
      var el = setup();
      expect(el.isolateScope().isTabActive()).toBe(false);
      tabsCtrl.selectedTab = tabCtrl.$scope;
      expect(el.isolateScope().isTabActive()).toBe(true);
      tabsCtrl.selectedTab = null;
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

    it('should select tab on click', function() {
      var el = setup();
      el.triggerHandler('click');
      expect(tabsCtrl.select).toHaveBeenCalledWith(tabCtrl.$scope, true);
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

      el.isolateScope().isTabActive = function() { return true; };
      el.isolateScope().$apply();
      expect(el.hasClass('active')).toBe(true);
      expect(el.find('.icon.true').length).toBe(1);
      expect(el.find('.icon.false').length).toBe(0);

      el.isolateScope().isTabActive = function() { return false; };
      el.isolateScope().$apply();
      expect(el.hasClass('active')).toBe(false);
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
