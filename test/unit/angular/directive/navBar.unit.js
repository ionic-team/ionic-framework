describe('ionNavBar', function() {
  describe('$ionicNavBar controller', function() {
    beforeEach(module('ionic'));

    var el, parent, ctrl, $scope;
    function setup(locals) {
      inject(function($compile, $rootScope) {
        parent = angular.element('<div>');
        el = angular.element('<ion-nav-bar>');
        parent.append(el);
        $scope = $rootScope.$new();
        $compile(el)($scope);
        ctrl = parent.data('$ionNavBarController');
      });
    }

    it('should set $scope.$isBackButtonShown with showBackButton', function() {
      setup();
      expect(el.scope().$isBackButtonShown).toBeUndefined();
      ctrl.showBackButton(true);
      expect(el.scope().$isBackButtonShown).toBe(true);
      ctrl.showBackButton(false);
      expect(el.scope().$isBackButtonShown).toBe(false);
    });

    it('should set visibleBar', function() {
      setup();
      expect(el.hasClass('hide')).toBe(false);
      ctrl.visibleBar(false);
      expect(el.hasClass('hide')).toBe(true);
      ctrl.visibleBar(true);
      expect(el.hasClass('hide')).toBe(false);
    });

    it('should set $parent.$hasHeader with showBar', function() {
      setup();
      expect(el.scope().$parent.$hasHeader).toBeUndefined();
      ctrl.showBar(true);
      expect(el.scope().$parent.$hasHeader).toBe(true);
      ctrl.showBar(false);
      expect(el.scope().$parent.$hasHeader).toBe(false);
    });

    it('should set title', function() {
      setup();
      expect(el.scope().$title).toBeFalsy();
      ctrl.title('foo');
      expect(el.scope().$title).toBe('foo');
      ctrl.title('bar');
      expect(el.scope().$title).toBe('bar');
    });

    it('should get title', function() {
      setup();
      expect(ctrl.title()).toBeFalsy();
      ctrl.title('foo');
      expect(ctrl.title()).toBe('foo');
    });

    it('should showBar=true with update data showNavBar=true', function() {
      setup();
      ctrl.update({
        showNavBar: true,
        hasHeaderBar: false
      });
      expect(ctrl.showBar()).toBe(true);
    });

    it('should showBar=false with update data showNavBar=false', function() {
      setup();
      ctrl.update({
        showNavBar: false,
        hasHeaderBar: false
      });
      expect(ctrl.showBar()).toBe(false);
    });

    it('should showBar=false with update data showNavBar=true and hasHeaderBar=true', function() {
      setup();
      ctrl.update({
        showNavBar: false,
        hasHeaderBar: true
      });
      expect(ctrl.showBar()).toBe(false);
    });

  });

  describe('directive', function() {
    beforeEach(module('ionic'));
    function setup(attrs, content) {
      var el;
      inject(function($compile, $rootScope) {
        el = $compile('<ion-nav-bar '+(attrs||'')+'>'+(content||'')+'</ion-nav-bar>')($rootScope.$new());
        $rootScope.$apply();
      });
      return el;
    }

    it('should prepend-transclude content', function() {
      var el = setup('', '<span><b>super</b> content {{4}}</span>');
      expect(el.children().eq(0).html()).toBe('<b>super</b> content 4');
    });

    it('should set $parent.$hasHeader to false on $scope.$destroy', function() {
      var el = setup();
      var parentScope = el.scope().$parent;
      parentScope.$hasHeader = true;
      el.scope().$destroy();
      expect(parentScope.$hasHeader).toBe(false);
    });

    it('should register with $ionicNavBarDelegate', inject(function($ionicNavBarDelegate) {
      var deregisterSpy = jasmine.createSpy('deregister');
      spyOn($ionicNavBarDelegate, '_registerInstance').andCallFake(function() {
        return deregisterSpy;
      });

      var el = setup('delegate-handle="theBestHandle"');
      expect($ionicNavBarDelegate._registerInstance)
        .toHaveBeenCalledWith(el.controller('ionNavBar'), 'theBestHandle');

      expect(deregisterSpy).not.toHaveBeenCalled();
      el.scope().$destroy();
      expect(deregisterSpy).toHaveBeenCalled();
    }));

  });

});
