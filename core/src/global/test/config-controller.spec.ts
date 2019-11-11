import { Config } from '../config';

describe('Config', () => {
  it('should get a value from the config', () => {
    const config = new Config();
    config.reset({ name: 'Doc Brown' });
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.getBoolean('name')).toBe(false);
  });

  it('should get a boolean value', () => {
    const config = new Config();
    config.reset({
      bool0: false,
      bool1: 'false',
      bool2: true,
      bool3: 'true',
      bool4: 'hola',
      bool5: 0,
      bool6: 1
    });
    expect(config.getBoolean('bool0')).toEqual(false);
    expect(config.getBoolean('bool1')).toEqual(false);
    expect(config.getBoolean('bool2')).toEqual(true);
    expect(config.getBoolean('bool3')).toEqual(true);
    expect(config.getBoolean('bool4')).toEqual(false);
    expect(config.getBoolean('bool5')).toEqual(false);
    expect(config.getBoolean('bool6')).toEqual(true);
  });

  it('should get a number value', () => {
    const config = new Config();
    config.reset({
      nu0: 0,
      nu1: -1,
      nu2: '200',
      nu3: '2.3',
      nu4: -100.2
    });
    expect(config.getNumber('nu0')).toEqual(0);
    expect(config.getNumber('nu1')).toEqual(-1);
    expect(config.getNumber('nu2')).toEqual(200);
    expect(config.getNumber('nu3')).toEqual(2.3);
    expect(config.getNumber('nu4')).toEqual(-100.2);
  });

  it('should not get fallback', () => {
    const config = new Config();
    config.reset({
      text0: '',
      text1: 'hola',

      bool0: false,
      bool1: 0,

      nu0: '0',
      nu1: 0,
      nu2: 10,
    });
    expect(config.get('text0', 'HEY')).toEqual('');
    expect(config.get('text1', 'HEY')).toEqual('hola');

    expect(config.getBoolean('bool0', true)).toEqual(false);
    expect(config.getBoolean('bool1', true)).toEqual(false);

    expect(config.getNumber('nu0', 100)).toEqual(0);
    expect(config.getNumber('nu1', 100)).toEqual(0);
    expect(config.getNumber('nu2', 100)).toEqual(10);
  });

  it('should get fallback', () => {
    const config = new Config();
    expect(config.get('text0', 'HEY')).toEqual('HEY');
    expect(config.getBoolean('bool0', true)).toEqual(true);
    expect(config.getNumber('nu0', 100)).toEqual(100);
  });

  it('should set value', () => {
    const config = new Config();
    expect(config.get('text0', 'HEY')).toEqual('HEY');
    config.set('text0', 'hola');
    expect(config.get('text0', 'HEY')).toEqual('hola');
  });
});
