describe('tabs', function() {
  beforeEach(module('ionic.ui.tabs'));

  describe('$ionicTabs controller', function() {

    var ctrl, scope;
    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('$ionicTabs', {
        $scope: scope
      });
    }));

    it('select should change getSelectedControllerIndex', function() {
      // Verify no items selected
      expect(ctrl.getSelectedControllerIndex()).toBeUndefined();
      expect(scope.selectedIndex).toBe(-1);

      // Try selecting beyond the bounds
      ctrl.selectController(1);
      expect(ctrl.getSelectedControllerIndex()).toBeUndefined();
      expect(scope.selectedIndex).toBe(-1);

      // Add a controller
      ctrl.add({
        title: 'Cats',
        icon: 'icon-kitty-kat'
      });

      expect(ctrl.getSelectedControllerIndex()).toEqual(0);
      expect(scope.selectedIndex).toBe(0);

      ctrl.add({
        title: 'Cats',
        icon: 'icon-kitty-kat'
      });

      expect(ctrl.getSelectedControllerIndex()).toEqual(0);
      expect(scope.selectedIndex).toBe(0);

      ctrl.select(1);

      expect(ctrl.getSelectedControllerIndex()).toEqual(1);
      expect(scope.selectedIndex).toBe(1);
    });

    it('select should emit viewData if emit is passed in', function() {
      ctrl.add({ title: 'foo', icon: 'icon' });
      ctrl.add({ title: 'bar', icon: 'icon2' });

      var viewData;
      spyOn(scope, '$emit').andCallFake(function(e, data) {
        viewData = data;
      });

      ctrl.select(0);
      expect(scope.$emit).not.toHaveBeenCalled();

      ctrl.select(1, true);
      expect(scope.$emit).toHaveBeenCalledWith('viewState.changeHistory', jasmine.any(Object));
      expect(viewData).toBeTruthy();
      expect(viewData.type).toBe('tab');
      expect(viewData.typeIndex).toBe(1);
      expect(viewData.title).toBe('bar');
    });
    it('select should go to root if emit is true and selecting same tab index', inject(function($ionicViewService) {
      ctrl.add({ title: 'foo', icon: 'icon' });

      spyOn($ionicViewService, 'goToHistoryRoot');
      spyOn($ionicViewService, 'getCurrentView').andCallFake(function() {
        return { historyId:'001' };
      });

      expect(scope.selectedIndex).toBe(0);
      //Emit != true
      ctrl.select(0);
      expect($ionicViewService.goToHistoryRoot).not.toHaveBeenCalled();

      ctrl.select(0, true);
      expect($ionicViewService.goToHistoryRoot).toHaveBeenCalledWith('001');
    }));
    it('select should call change callback', function() {
      scope.onControllerChanged = function(oldC, oldI, newC, newI) {
      };

      // Add a controller
      ctrl.add({ title: 'Cats', icon: 'icon-kitty-kat' });
      ctrl.add({ title: 'Dogs', icon: 'icon-rufus' });

      spyOn(ctrl, 'controllerChanged');

      expect(ctrl.getSelectedControllerIndex()).toEqual(0);
      ctrl.select(1);

      expect(ctrl.controllerChanged).toHaveBeenCalled();
    });
    it('select should change activeAnimation=animation', function() {
      // Add a controller
      ctrl.add({ title: 'Cats', icon: 'icon-kitty-kat' });
      ctrl.add({ title: 'Dogs', icon: 'icon-rufus' });

      expect(scope.activeAnimation).toBeUndefined();
      scope.animation = 'superfast';
      ctrl.select(1);
      expect(scope.activeAnimation).toBe('superfast');

      scope.animation = 'woah';
      ctrl.select(0);
      expect(scope.activeAnimation).toBe('woah');
    });

  });

  describe('tabs directive', function() {
    var compile, scope, element;
    beforeEach(inject(function($compile, $rootScope) {
      compile = $compile;
      scope = $rootScope;
    }));

    it('Has tab class', function() {
      var element = compile('<ion-tabs></ion-tabs>')(scope);
      scope.$digest();
      expect(element.find('.tabs').hasClass('tabs')).toBe(true);
    });

    it('Has tab children', function() {
      element = compile('<ion-tabs></ion-tabs>')(scope);
      scope = element.scope();
      scope.controllers = [
        { title: 'Home', icon: 'icon-home' },
        { title: 'Fun', icon: 'icon-fun' },
        { title: 'Beer', icon: 'icon-beer' },
      ];
      scope.$digest();
      expect(element.find('a').length).toBe(3);
    });

    it('Has compiled children', function() {
      element = compile('<ion-tabs>' +
        '<ion-tab active="true" title="Item" icon="icon-default"></ion-tab>' +
        '<ion-tab active="true" title="Item" icon="icon-default"></ion-tab>' +
      '</ion-tabs>')(scope);
      scope.$digest();
      expect(element.find('a').length).toBe(2);
    });

    it('Sets style on child tabs', function() {
      element = compile('<ion-tabs tabs-type="tabs-positive" tabs-style="tabs-icon-bottom">' +
        '<ion-tab active="true" title="Item" icon="icon-default"></ion-tab>' +
        '<ion-tab active="true" title="Item" icon="icon-default"></ion-tab>' +
      '</ion-tabs>')(scope);
      scope.$digest();
      var tabs = element[0].querySelector('.tabs');
      expect(angular.element(tabs).hasClass('tabs-positive')).toEqual(true);
      expect(angular.element(tabs).hasClass('tabs-icon-bottom')).toEqual(true);
    });

    it('Has nav-view', function() {
      element = compile('<ion-tabs>' +
        '<ion-tab active="true" title="Item 1" href="#/page1"><ion-nav-view name="name1"></ion-nav-view></ion-tab>' +
        '<ion-tab active="true" title="Item 2" href="/page2">content2</ion-tab>' +
      '</ion-tabs>')(scope);
      scope = element.scope();
      scope.$digest();
      expect(scope.tabCount).toEqual(2);
      expect(scope.selectedIndex).toEqual(0);
      expect(scope.controllers.length).toEqual(2);
      expect(scope.controllers[0].hasNavView).toEqual(true);
      expect(scope.controllers[0].navViewName).toEqual('name1');
      expect(scope.controllers[0].url).toEqual('/page1');
      expect(scope.controllers[1].hasNavView).toEqual(false);
      expect(scope.controllers[1].url).toEqual('/page2');
    });

  });

  describe('tab-item Directive', function() {

    var compile, element, scope, ctrl;
    beforeEach(inject(function($compile, $rootScope, $document, $controller) {
      compile = $compile;
      scope = $rootScope.$new();

      scope.badgeValue = 3;
      scope.badgeStyleValue = 'badge-assertive';
      element = compile('<ion-tabs>' +
        '<ion-tab title="Item" icon="icon-default" badge="badgeValue" badge-style="{{badgeStyleValue}}"></ion-tab>' +
        '</ion-tabs>')(scope);
      scope.$digest();
      $document[0].body.appendChild(element[0]);
    }));

    it('Title works', function() {
      //The badge's text gets in the way of just doing .text() on the element itself, so exclude it
      var notBadge = angular.element(element[0].querySelectorAll('a >:not(.badge)'));
      expect(notBadge.text().trim()).toEqual('Item');
    });

    it('Default icon works', function() {
      scope.$digest();
      var i = element[0].querySelectorAll('i')[1];
      expect(angular.element(i).hasClass('icon-default')).toEqual(true);
    });

    it('Badge works', function() {
      scope.$digest();
      var i = element[0].querySelector('.badge');
      expect(i.innerHTML).toEqual('3');
      expect(i.className).toMatch('badge-assertive');
      scope.$apply("badgeStyleValue = 'badge-danger'");
      expect(i.className).toMatch('badge-danger');
    });

    it('Badge updates', function() {
      scope.badgeValue = 10;
      scope.$digest();
      var i = element[0].querySelectorAll('i')[0];
      expect(i.innerHTML).toEqual('10');
    });

    it('Click sets correct tab index', function() {
      var a = element.find('a:eq(0)');
      var itemScope = a.isolateScope();
      //spyOn(a, 'click');
      spyOn(itemScope, 'selectTab');
      a.click();
      expect(itemScope.selectTab).toHaveBeenCalled();
    });
  });

  describe('tab directive', function() {
    var scope, tab;
    beforeEach(inject(function($compile, $rootScope, $controller) {
      var tabsScope = $rootScope.$new();
      //Setup a fake tabs controller for our tab to use so we dont have to have a parent tabs directive (isolated test)
      var ctrl = $controller('$ionicTabs', {
        $scope: tabsScope
      });

      //Create an outer div that has a tabsController on it so ion-tab thinks it's in a <ion-tabs>
      var element = angular.element('<div><ion-tab><div class="my-content"></div></ion-tab></div>');
      element.data('$tabsController', ctrl);
      $compile(element)(tabsScope)
      tabsScope.$apply();

      tab = element.find('tab');
      scope = tab.scope();
    }));
  });

  describe('tab-controller-item Directive', function() {

    var compile, element, scope, ctrl;
    beforeEach(inject(function($compile, $rootScope, $document, $controller) {
      compile = $compile;
      scope = $rootScope;

      scope.badgeValue = 3;
      scope.isActive = false;
      element = compile('<ion-tabs class="tabs">' +
        '<ion-tab-controller-item icon-title="Icon <b>title</b>" icon="icon-class" icon-on="icon-on-class" icon-off="icon-off-class" badge="badgeValue" badge-style="badgeStyle" active="isActive" index="0"></ion-tab-controller-item>' +
      '</ion-tabs>')(scope);
      scope.$digest();
      $document[0].body.appendChild(element[0]);
    }));

    it('Icon title works as html', function() {
      expect(element.find('a').find('span').html()).toEqual('Icon <b>title</b>');
    });

    it('Icon classes works', function() {
      var title = '';
      var elements = element[0].querySelectorAll('.icon-class');
      expect(elements.length).toEqual(1);
      var elements = element[0].querySelectorAll('.icon-off-class');
      expect(elements.length).toEqual(1);
    });

    it('Active switch works', function() {
      var elements = element[0].querySelectorAll('.icon-on-class');
      expect(elements.length).toEqual(0);

      scope.isActive = true;
      scope.$digest();

      var elements = element[0].querySelectorAll('.icon-on-class');
      expect(elements.length).toEqual(1);
    });

    it('Badge updates', function() {
      scope.badgeValue = 10;
      scope.badgeStyle = 'badge-assertive';
      scope.$digest();
      var i = element[0].querySelector('.badge');
      expect(i.innerHTML).toEqual('10');
      expect(i.className).toMatch('badge-assertive');
      scope.$apply('badgeStyle = "badge-super"');
      expect(i.className).toMatch('badge-super');
    });


  });
});


