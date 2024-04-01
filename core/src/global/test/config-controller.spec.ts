import type { IonicConfig } from '../../interface';
import { Config } from '../config';

describe('Config', () => {
  it('should get a value from the config', () => {
    const config = new Config();
    config.reset({
      mode: 'ios',
    } as IonicConfig);
    expect(config.get('mode')).toEqual(
      'ios'
    );
    expect(
      config.getBoolean('mode')
    ).toBe(false);
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
      bool6: 1,
    } as any);
    expect(
      config.getBoolean('bool0' as any)
    ).toEqual(false);
    expect(
      config.getBoolean('bool1' as any)
    ).toEqual(false);
    expect(
      config.getBoolean('bool2' as any)
    ).toEqual(true);
    expect(
      config.getBoolean('bool3' as any)
    ).toEqual(true);
    expect(
      config.getBoolean('bool4' as any)
    ).toEqual(false);
    expect(
      config.getBoolean('bool5' as any)
    ).toEqual(false);
    expect(
      config.getBoolean('bool6' as any)
    ).toEqual(true);
  });

  it('should get a number value', () => {
    const config = new Config();
    config.reset({
      nu0: 0,
      nu1: -1,
      nu2: '200',
      nu3: '2.3',
      nu4: -100.2,
    } as any);
    expect(
      config.getNumber('nu0' as any)
    ).toEqual(0);
    expect(
      config.getNumber('nu1' as any)
    ).toEqual(-1);
    expect(
      config.getNumber('nu2' as any)
    ).toEqual(200);
    expect(
      config.getNumber('nu3' as any)
    ).toEqual(2.3);
    expect(
      config.getNumber('nu4' as any)
    ).toEqual(-100.2);
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
    } as any);
    expect(
      config.get('text0' as any, 'HEY')
    ).toEqual('');
    expect(
      config.get('text1' as any, 'HEY')
    ).toEqual('hola');

    expect(
      config.getBoolean(
        'bool0' as any,
        true
      )
    ).toEqual(false);
    expect(
      config.getBoolean(
        'bool1' as any,
        true
      )
    ).toEqual(false);

    expect(
      config.getNumber(
        'nu0' as any,
        100
      )
    ).toEqual(0);
    expect(
      config.getNumber(
        'nu1' as any,
        100
      )
    ).toEqual(0);
    expect(
      config.getNumber(
        'nu2' as any,
        100
      )
    ).toEqual(10);
  });

  it('should get fallback', () => {
    const config = new Config();
    expect(
      config.get('text0' as any, 'HEY')
    ).toEqual('HEY');
    expect(
      config.getBoolean(
        'bool0' as any,
        true
      )
    ).toEqual(true);
    expect(
      config.getNumber(
        'nu0' as any,
        100
      )
    ).toEqual(100);
  });

  it('should set value', () => {
    const config = new Config();
    expect(
      config.get('text0' as any, 'HEY')
    ).toEqual('HEY');
    config.set('text0' as any, 'hola');
    expect(
      config.get('text0' as any, 'HEY')
    ).toEqual('hola');
  });
});
