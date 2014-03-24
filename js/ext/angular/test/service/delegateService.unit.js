describe('DelegateFactory', function() {
  function setup(methods) {
    var delegate;
    inject(function($log, $injector) {
      $log.error = jasmine.createSpy('error');
      delegate = $injector.instantiate(delegateService(methods || []));
    });
    return delegate;
  }

  it('should have properties', function() {
    expect(setup()._instances).toEqual({});
    expect(setup()._registerInstance).toEqual(jasmine.any(Function));
    expect(setup().forHandle).toEqual(jasmine.any(Function));
  });

  it('should allow reg & dereg of instance with handle', function() {
    var delegate = setup();
    var instance = {};
    var deregister = delegate._registerInstance(instance, 'handle');
    expect(delegate._instances['handle']).toBe(instance);
    deregister();
    expect(delegate._instances['handle']).toBeUndefined();
  });

  it('should allow reg & dereg of instance, and make its own handle', function() {
    spyOn(ionic.Utils, 'nextUid').andCallFake(function() {
      return 'uid';
    });
    var delegate = setup();
    var instance = {};
    var deregister = delegate._registerInstance(instance);
    expect(ionic.Utils.nextUid).toHaveBeenCalled();
    expect(delegate._instances['uid']).toBe(instance);
    deregister();
    expect(delegate._instances['uid']).toBeUndefined();
  });

  it('should have given methodNames on root', function() {
    var delegate = setup(['foo', 'bar']);
    expect(delegate.foo).toEqual(jasmine.any(Function));
    expect(delegate.bar).toEqual(jasmine.any(Function));
  });

  it('should call given methodNames on all instances with args', function() {
    var delegate = setup(['foo', 'bar']);
    var instance1 = {
      foo: jasmine.createSpy('foo1'),
      bar: jasmine.createSpy('bar1')
    };
    var instance2 = {
      foo: jasmine.createSpy('foo1'),
      bar: jasmine.createSpy('bar1')
    };
    delegate._registerInstance(instance1);
    delegate._registerInstance(instance2);

    expect(instance1.foo).not.toHaveBeenCalled();
    expect(instance2.foo).not.toHaveBeenCalled();
    delegate.foo('a', 'b', 'c');
    expect(instance1.foo).toHaveBeenCalledWith('a', 'b', 'c');
    expect(instance2.foo).toHaveBeenCalledWith('a', 'b', 'c');

    instance1.foo.reset();
    instance2.foo.reset();
    delegate.foo(1, 2, 3);
    expect(instance1.foo).toHaveBeenCalledWith(1, 2, 3);
    expect(instance2.foo).toHaveBeenCalledWith(1, 2, 3);

    expect(instance1.bar).not.toHaveBeenCalled();
    expect(instance2.bar).not.toHaveBeenCalled();
    delegate.bar('something');
    expect(instance1.bar).toHaveBeenCalledWith('something');
    expect(instance2.bar).toHaveBeenCalledWith('something');
  });

  it('should return the first return value from multiple instances', function() {
    var delegate = setup(['fn']);
    var instance1 = {
      fn: jasmine.createSpy('fn').andCallFake(function() {
        return 'ret1';
      })
    };
    var instance2 = {
      fn: jasmine.createSpy('fn').andCallFake(function() {
        return 'ret2';
      })
    };
    var deregister = delegate._registerInstance(instance1);
    delegate._registerInstance(instance2);

    expect(delegate.fn()).toBe('ret1');
    deregister();
    expect(delegate.fn()).toBe('ret2');
  });

  it('forHandle should return this for blank handle', function() {
    var delegate = setup();
    expect(delegate.forHandle()).toBe(delegate);
  });

  describe('forHandle', function() {
    var delegate, instance1, instance2;
    beforeEach(function() {
      delegate = setup(['a']);
      instance1 = {
        a: jasmine.createSpy('a1').andCallFake(function() {
          return 'a1';
        }),
      };
      instance2 = {
        a: jasmine.createSpy('a2').andCallFake(function() {
          return 'a2';
        }),
      };
    });
    it('should return an InstanceWithHandle object with fields', function() {
      expect(delegate.forHandle('one').a).toEqual(jasmine.any(Function));
      expect(delegate.forHandle('two').a).toEqual(jasmine.any(Function));
      expect(delegate.forHandle('invalid').a).toEqual(jasmine.any(Function));
    });
    it('should do nothing if calling for a non-added instance', function() {
      expect(delegate.forHandle('one').a()).toBeUndefined();
    });
    it('should call an added instance\'s method', function() {
      delegate._registerInstance(instance1, '1');
      delegate._registerInstance(instance2, '2');

      var result = delegate.forHandle('1').a(1,2,3);
      expect(instance1.a).toHaveBeenCalledWith(1,2,3);
      expect(instance2.a).not.toHaveBeenCalled();
      expect(result).toBe('a1');

      instance1.a.reset();
      var result = delegate.forHandle('2').a(2,3,4);
      expect(instance2.a).toHaveBeenCalledWith(2,3,4);
      expect(instance1.a).not.toHaveBeenCalled();
      expect(result).toBe('a2');
    });
  });
});
