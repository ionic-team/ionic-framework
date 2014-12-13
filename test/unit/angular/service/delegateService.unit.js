describe('DelegateFactory', function() {
  function setup(methods) {
    var delegate;
    inject(function($log, $injector) {
      delegate = $injector.instantiate(ionic.DelegateService(methods || []));
    });
    return delegate;
  }

  it('should have properties', function() {
    expect(setup()._instances).toEqual([]);
    expect(setup()._registerInstance).toEqual(jasmine.any(Function));
    expect(setup().$getByHandle).toEqual(jasmine.any(Function));
  });

  it('should allow reg & dereg of instance with handle', function() {
    var delegate = setup();
    var instance = {};
    var deregister = delegate._registerInstance(instance, 'handle');
    expect(instance.$$delegateHandle).toBe('handle');
    expect(delegate._instances[0]).toBe(instance);
    deregister();
    expect(delegate._instances.length).toBe(0);
  });

  it('should allow reg & dereg of instance, without handle', function() {
    var delegate = setup();
    var instance = {};
    var deregister = delegate._registerInstance(instance, null);
    expect(instance.$$delegateHandle).toBe(null);
    expect(delegate._instances[0]).toBe(instance);
    deregister();
    expect(delegate._instances.length).toBe(0);
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
      fn: jasmine.createSpy('fn').andReturn('ret1')
    };
    var instance2 = {
      fn: jasmine.createSpy('fn').andReturn('ret2')
    };
    var deregister = delegate._registerInstance(instance1);
    delegate._registerInstance(instance2);

    expect(delegate.fn()).toBe('ret1');
    deregister();
    expect(delegate.fn()).toBe('ret2');
  });

  it('should return the first active instance return value when multiple instances w/ undefined handle', function() {
    var delegate = setup(['fn']);
    var instance1 = {
      fn: jasmine.createSpy('fn').andReturn('ret1')
    };
    var instance2 = {
      fn: jasmine.createSpy('fn').andReturn('ret2')
    };
    delegate._registerInstance(instance1, undefined, function() {
      return false;
    });
    delegate._registerInstance(instance2, undefined, function() {
      return true;
    });

    expect(instance1.fn).not.toHaveBeenCalled();
    expect(delegate.fn()).toBe('ret2');
  });

  it('should return the first active instance return value when multiple instances w/ same handle', function() {
    var delegate = setup(['fn']);
    var instance1 = {
      fn: jasmine.createSpy('fn').andReturn('ret1')
    };
    var instance2 = {
      fn: jasmine.createSpy('fn').andReturn('ret2')
    };
    delegate._registerInstance(instance1, 'myhandle', function() {
      return true;
    });
    delegate._registerInstance(instance2, 'myhandle', function() {
      return false;
    });

    expect(instance2.fn).not.toHaveBeenCalled();
    expect(delegate.fn()).toBe('ret1');
  });

  describe('$getByHandle', function() {
    var delegate, instance1, instance2, instance3;
    beforeEach(function() {
      delegate = setup(['a']);
      instance1 = {
        a: jasmine.createSpy('a1').andReturn('a1')
      };
      instance2 = {
        a: jasmine.createSpy('a2').andReturn('a2')
      };
      instance3 = {
        a: jasmine.createSpy('a3').andReturn('a3')
      };
    });

    it('should return an InstanceWithHandle object with fields', function() {
      expect(delegate.$getByHandle('one').a).toEqual(jasmine.any(Function));
      expect(delegate.$getByHandle('two').a).toEqual(jasmine.any(Function));
      expect(delegate.$getByHandle('invalid').a).toEqual(jasmine.any(Function));
    });

    it('should noop & warn if calling for a non-added instance', inject(function($log) {
      spyOn($log, 'warn');
      expect(delegate.$getByHandle('one').a()).toBeUndefined();
      expect($log.warn).toHaveBeenCalled();
    }));

    it('should call an added instance\'s method', function() {
      delegate._registerInstance(instance1, '1');
      delegate._registerInstance(instance2, '2');

      var result = delegate.$getByHandle('1').a(1,2,3);
      expect(instance1.a).toHaveBeenCalledWith(1,2,3);
      expect(instance2.a).not.toHaveBeenCalled();
      expect(result).toBe('a1');

      instance1.a.reset();
      result = delegate.$getByHandle('2').a(2,3,4);
      expect(instance2.a).toHaveBeenCalledWith(2,3,4);
      expect(instance1.a).not.toHaveBeenCalled();
      expect(result).toBe('a2');
    });

    it('should call multiple instances with the same handle', function() {
      var deregister = delegate._registerInstance(instance1, '1');
      delegate._registerInstance(instance2, '1');
      delegate._registerInstance(instance3, 'other');

      var delegateInstance = delegate.$getByHandle('1');

      expect(instance1.a).not.toHaveBeenCalled();
      expect(instance2.a).not.toHaveBeenCalled();
      expect(instance3.a).not.toHaveBeenCalled();
      var result = delegateInstance.a('1');
      expect(instance1.a).toHaveBeenCalledWith('1');
      expect(instance2.a).toHaveBeenCalledWith('1');
      expect(instance3.a).not.toHaveBeenCalled();
      expect(result).toBe('a1');

      instance1.a.reset();
      deregister();
      result = delegateInstance.a(2);
      expect(instance1.a).not.toHaveBeenCalled();
      expect(instance2.a).toHaveBeenCalledWith(2);
      expect(instance3.a).not.toHaveBeenCalled();
      expect(result).toBe('a2');
    });

    it('should get the only active instance from multiple instances with the same handle', function() {
      delegate._registerInstance(instance1, 'myhandle', function() { return false; });
      delegate._registerInstance(instance2, 'myhandle', function() { return true; });
      delegate._registerInstance(instance3, 'myhandle', function() { return false; });

      var delegateInstance = delegate.$getByHandle('myhandle');

      expect(instance1.a).not.toHaveBeenCalled();
      expect(instance2.a).not.toHaveBeenCalled();
      expect(instance3.a).not.toHaveBeenCalled();

      var result = delegateInstance.a('test-a');
      expect(instance1.a).not.toHaveBeenCalled();
      expect(instance2.a).toHaveBeenCalledWith('test-a');
      expect(instance3.a).not.toHaveBeenCalled();
      expect(result).toBe('a2');
    });

    it('should get active instance when multiple sname name handles, among multiple active instances', function() {
      delegate._registerInstance(instance1, 'myhandle-1', function() { return true; });
      delegate._registerInstance(instance2, 'myhandle-2', function() { return false; });
      delegate._registerInstance(instance3, 'myhandle-2', function() { return true; });

      var delegateInstance = delegate.$getByHandle('myhandle-2');

      expect(instance1.a).not.toHaveBeenCalled();
      expect(instance2.a).not.toHaveBeenCalled();
      expect(instance3.a).not.toHaveBeenCalled();

      var result = delegateInstance.a('test-a');
      expect(instance1.a).not.toHaveBeenCalled();
      expect(instance2.a).not.toHaveBeenCalled();
      expect(instance3.a).toHaveBeenCalledWith('test-a');
      expect(result).toBe('a3');
    });

  });
});
