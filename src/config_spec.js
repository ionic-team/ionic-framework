import {IonConfig} from './config';

// TODO stop hardcoding platforms and media sizes
export function main() {
  var rootConfig;
  beforeEach(() => {
    rootConfig = new IonConfig();
  });

  it('should create a config one level down', () => {
    var sub = rootConfig.platform('ios');
    expect(sub._parent).toBe(rootConfig);
    expect(sub._path).toEqual(['ios']);
    expect(rootConfig._cases.ios).toBe(sub);
  });

  it('should create a config two levels down', () => {
    var sub1 = rootConfig.platform('ios');
    var sub2 = sub1.media('lg');
    expect(sub2._parent).toBe(sub1);
    expect(sub1._parent).toBe(rootConfig);
    expect(rootConfig._cases['ios lg']).toBe(sub2);
    expect(rootConfig._cases.ios).toBe(sub1);
  });

  it('set should be chainable', () => {
    expect(rootConfig.set()).toBe(rootConfig);
  });

  it('should set values on the root', () => {
    rootConfig.set({
      letter: 'a'
    });
    expect(rootConfig.get('letter')).toBe('a');
  });

  it('should always return the same object for the same key', () => {
    expect(rootConfig.platform('android')).toBe(rootConfig.platform('android'));
    expect(rootConfig.platform('ios')).toBe(rootConfig.platform('ios'));
    expect(rootConfig.media('lg')).toBe(rootConfig.media('lg'));
  });

  it('should return the same object when nesting in different order', () => {
    var sub1 = rootConfig.platform('ios').media('sm');
    var sub2 = rootConfig.media('sm').platform('ios');
    expect(sub1).toBe(sub2);
  });

  it('should return the same object when nesting in different order for huge queries', () => {
    var sub1 = rootConfig.platform('ios').media('sm').platform('android').media('lg');
    var sub2 = rootConfig.media('sm').media('lg').platform('android').platform('ios');
    expect(sub1).toBe(sub2);
  });

  it('should set values one level down and be chainable', () => {
    rootConfig.set({ letter: 'a' });
    var sub1 = rootConfig.platform('ios');
    expect(sub1.get('letter')).toBe('a');
    expect( sub1.set({ letter: 'b' }) ).toBe(sub1);
    expect(sub1.get('letter')).toBe('b');
  });

  it('should set values two levels down and be chainable', () => {
    rootConfig.set({ letter: 'a' });
    var sub1 = rootConfig.platform('ios');
    sub1.set({ letter: 'b' });
    var sub2 = sub1.media('lg');
    expect(sub2.get('letter')).toBe('b');
    expect( sub2.set({ letter: 'c' }) ).toBe(sub2);
    expect(sub2.get('letter')).toBe('c');
  });

  it('should use parent\'s value if its later set to undefined', () => {
    rootConfig.set({ letter: 'a' });
    var sub1 = rootConfig.platform('ios');
    sub1.set({ letter: 'b' });
    expect(sub1.get('letter')).toBe('b');
    sub1.unset('letter');
    expect(sub1.get('letter')).toBe('a');
  });

  it('when() as alias for media()', () => {
    expect(rootConfig.when('lg')).toBe(rootConfig.media('lg'));
    expect(rootConfig.when('bad')).toBe(rootConfig);
    expect(rootConfig.when('lg')).not.toBe(rootConfig.when('ios'));
  });

  it('when() as alias for platform()', () => {
    expect(rootConfig.platform('ios')).toBe(rootConfig.when('ios'));
    expect(rootConfig.when('bad')).toBe(rootConfig);
  });

  describe('invokeConfig', function() {

    it('should invoke defaults', () => {
      var obj = {};
      rootConfig.set('foo', 'bar');
      rootConfig.invoke(obj);
    });

    it('should invoke defaults in nested whens', () => {
      var obj = {};
      rootConfig.set({ a: 'root', b: 'root' });
      rootConfig.when('ios').set({b: 'ios', c: 'ios'});
      rootConfig.when('ios').when('lg').set({ c: 'ios-lg', d: 'ios-lg' });

      rootConfig.invoke(obj);
      expect(obj).toEqual({
        a: 'root', 
        b: 'ios',
        c: 'ios-lg',
        d: 'ios-lg'
      });
    });

    it('should run behaviors', () => {
      var obj = {};
      rootConfig.behavior(instance => {
        instance.foo = 'bar';
      });
      rootConfig.invoke(obj);
      expect(obj.foo).toBe('bar');
    });

    it('should invoke behaviors in nested whens', () => {
      var obj = {};
      rootConfig.when('ios')
        .behavior(o => o.ios = true)
        .when('lg')
          .behavior(o => o.lg = true)
      rootConfig.invoke(obj);
      expect(obj).toEqual({
        ios: true,
        lg: true
      });
    });
  });
}
