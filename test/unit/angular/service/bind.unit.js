describe('$ionicBind', function() {
  beforeEach(module('ionic'));

  var $bind, scope, attr, $observeFn;
  beforeEach(inject(function($ionicBind, $rootScope, $interpolate) {
    $bind = $ionicBind;
    scope = $rootScope.$new();
    attr = {
      $observe: jasmine.createSpy('observe').andCallFake(function(name, fn) {
        $observeFn = fn;
      })
    };
  }));

  describe('= bind', function() {

    it('should bind expression to scope', function() {
      scope.$parent.coffee = 2;
      attr.eq = 'coffee';
      $bind(scope, attr, {
        eq: '='
      });
      scope.$apply();
      expect(scope.eq).toEqual(2);
      scope.$parent.$apply('coffee = 100');
      expect(scope.eq).toEqual(100);
    });

    it('should allow binding a different name to scope', function() {
      scope.$parent.coffee = 2;
      attr.eq = 'coffee';
      $bind(scope, attr, {
        coolVar: '=eq'
      });
      scope.$apply();
      expect(scope.coolVar).toEqual(scope.$parent.coffee);
      scope.$parent.$apply('coffee = 100');
      expect(scope.coolVar).toEqual(100);
    });

    it('should work as expected if bind name is same', function() {
      scope.$parent.foo = 2;
      attr.espresso = 'foo';
      $bind(scope, attr, {
        foo: '=espresso'
      });
      scope.$apply();
      expect(scope.$parent.foo).toBe(2);
      scope.$parent.$apply('foo = 4');
      expect(scope.$parent.foo).toBe(4);
    });

    it('should unwatch on $destroy', function() {
      var watchUnregister = jasmine.createSpy('watchUnreg');
      spyOn(scope.$parent, '$watch').andCallFake(function() {
        return watchUnregister;
      });
      attr.binding = 'something';
      $bind(scope, attr, {
        binding: '='
      });
      scope.$destroy();
      expect(watchUnregister).toHaveBeenCalled();
    });
  });

  describe ('@ bind', function() {

    it('should bind expression to scope', function() {
      scope.$parent.coffee = 'cool';
      attr.special = '{{coffee}}';
      $bind(scope, attr, {
        special: '@'
      });
      expect(attr.$observe).toHaveBeenCalledWith('special', $observeFn);
      expect(scope.special).toBe('cool');
      scope.$parent.coffee = 'espresso';
      $observeFn(scope.$parent.coffee);
      expect(scope.special).toBe('espresso');
    });

    it('should allow binding a different name to scope', function() {
      scope.$parent.coffee = 'cool';
      attr.special = '{{coffee}}';
      $bind(scope, attr, {
        scopeName: '@special'
      });
      expect(scope.scopeName).toBe('cool');
      scope.$parent.coffee = 'espresso';
      $observeFn(scope.$parent.coffee);
      expect(scope.scopeName).toBe('espresso');
    });

    it('should allow binding a different name to scope', function() {
      scope.$parent.coffee = 'cool';
      attr.special = '{{coffee}}';
      $bind(scope, attr, {
        coffee: '@special'
      });
      expect(scope.coffee).toBe('cool');
      scope.$parent.coffee = 'espresso';
      $observeFn(scope.$parent.coffee);
      expect(scope.coffee).toBe('espresso');
    });

  });

  describe('& bind', function() {

    it('should bind expression to scope', function() {
      attr.math = '1+1';
      $bind(scope, attr, {
        two: '&math'
      });
      expect(scope.two()).toBe(2);
    });

    it('should bind expression with different name to scope', function() {
      attr.doIt = 'fun()';
      scope.$parent.fun = function() {
        return 'this is cool!';
      };
      $bind(scope, attr, {
        party: '&doIt'
      });
      expect(scope.party()).toBe('this is cool!');
    });

    it('should error for similar scopeName and expression', function() {
      scope.$parent.foo = function(){};
      attr.bar = 'foo()';
      expect(function() {
        $bind(scope, attr, { foo: '&bar' });
      }).toThrow();
    });
  });
});
