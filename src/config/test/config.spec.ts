import { Config } from '../config';
import { Platform } from '../../platform/platform';
import { QueryParams } from '../../platform/query-params';
import { PLATFORM_CONFIGS } from '../../platform/platform-registry';
import { registerModeConfigs } from '../mode-registry';


describe('Config', () => {

  it('should set activator setting to none for old Android Browser on a linux device', () => {
    platform.setUserAgent('Mozilla/5.0 (Linux; U; Android 4.2.2; nl-nl; GT-I9505 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30');
    platform.setNavigatorPlatform('linux');
    platform.setQueryParams(qp);
    platform.init();
    config.init(null, qp, platform);

    expect(config.get('activator')).toEqual('none');
  });

  it('should set activator setting to ripple for Android dev tools simulation on a mac', () => {
    platform.setUserAgent('Mozilla/5.0 (Linux; U; Android 4.2.2; nl-nl; GT-I9505 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30');
    platform.setNavigatorPlatform('MacIntel');
    platform.setQueryParams(qp);
    platform.init();
    config.init(null, qp, platform);

    expect(config.get('activator')).toEqual('ripple');
  });

  it('should set activator setting to none for Android Chrome versions below v36 on a linux device', () => {
    platform.setUserAgent('Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1650.59 Mobile Safari/537.36');
    platform.setNavigatorPlatform('linux');
    platform.setQueryParams(qp);
    platform.init();
    config.init(null, qp, platform);

    expect(config.get('activator')).toEqual('none');
  });

  it('should set activator setting to ripple for Android Chrome v36 and above on a linux device', () => {
    platform.setUserAgent('Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1650.59 Mobile Safari/537.36');
    platform.setNavigatorPlatform('linux');
    platform.setQueryParams(qp);
    platform.init();
    config.init(null, qp, platform);

    expect(config.get('activator')).toEqual('ripple');
  });

  it('should set activator setting to ripple for Android v5.0 and above on a linux device not using Chrome', () => {
    platform.setUserAgent('Mozilla/5.0 (Android 5.0; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0');
    platform.setNavigatorPlatform('linux');
    platform.setQueryParams(qp);
    platform.init();
    config.init(null, qp, platform);

    expect(config.get('activator')).toEqual('ripple');
  });

  it('should set activator setting to none for Android versions below v5.0 on a linux device not using Chrome', () => {
    platform.setUserAgent('Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0');
    platform.setNavigatorPlatform('linux');
    platform.setQueryParams(qp);
    platform.init();
    config.init(null, qp, platform);

    expect(config.get('activator')).toEqual('none');
  });

  it('should override mode settings', () => {
    platform._platforms = ['ios'];
    config.init({
      mode: 'md'
    }, qp, platform);

    expect(config.get('mode')).toEqual('md');
    expect(config.get('iconMode')).toEqual('md');
  });

  it('should override mode settings from platforms setting', () => {
    platform._platforms = ['ios'];
    config.init({
      platforms: {
        ios: {
          mode: 'md'
        }
      }
    }, qp, platform);

    expect(config.get('mode')).toEqual('md');
    expect(config.get('iconMode')).toEqual('md');
  });

  it('should get boolean value from querystring', () => {
    qp = new QueryParams('http://biff.com/?ionicanimate=true');
    config.init(null, qp, platform);
    expect(config.get('animate')).toEqual(true);

    config = new Config();
    qp = new QueryParams('http://biff.com/?ionicanimate=false');
    platform = new Platform();
    config.init(null, qp, platform);
    expect(config.get('animate')).toEqual(false);
  });

  it('should get value from case insensitive querystring key', () => {
    qp = new QueryParams('http://biff.com/?ionicConfigKey=b');
    config.init({
      mode: 'a'
    }, qp, platform);

    expect(config.get('configKey')).toEqual('b');
  });

  it('should get value from querystring', () => {
    qp = new QueryParams('http://biff.com/?ionicmode=modeB');
    config.init({
      mode: 'modeA'
    }, qp, platform);

    expect(config.get('mode')).toEqual('modeB');
  });

  it('should override mode platform', () => {
    platform._platforms = ['mobile'];
    config.init({
      mode: 'modeA',
      platforms: {
        mobile: {
          mode: 'modeB'
        },
        ios: {
          mode: 'modeC'
        }
      }
    }, qp, platform);

    expect(config.get('mode')).toEqual('modeB');
  });

  it('should override mode', () => {
    platform._platforms = ['core'];
    config.init({
      mode: 'modeA'
    }, qp, platform);

    expect(config.get('mode')).toEqual('modeA');
  });

  it('should get user settings after user platform settings', () => {
    platform._platforms = ['ios'];
    config.init({
      hoverCSS: true
    }, qp, platform);

    expect(config.get('hoverCSS')).toEqual(true);
  });

  it('should get md mode for core platform', () => {
    platform._platforms = ['core'];
    config.init(null, qp, platform);

    expect(config.get('mode')).toEqual('md');
  });

  it('should get ios mode for ipad platform', () => {
    platform._platforms = ['mobile', 'ios', 'ipad', 'tablet'];
    config.init(null, qp, platform);

    expect(config.get('mode')).toEqual('ios');
  });

  it('should get md mode for windows platform', () => {
    platform._platforms = ['mobile', 'windows'];
    config.init(null, qp, platform);

    expect(config.get('mode')).toEqual('wp');
  });

  it('should get md mode for android platform', () => {
    platform._platforms = ['mobile', 'android'];
    config.init(null, qp, platform);

    expect(config.get('mode')).toEqual('md');
  });

  it('should override ios mode config with user platform setting', () => {
    platform._platforms = ['ios'];
    config.init({
      tabsPlacement: 'hide',
      platforms: {
        ios: {
          tabsPlacement: 'top'
        }
      }
    }, qp, platform);

    expect(config.get('tabsPlacement')).toEqual('top');
  });

  it('should override ios mode config with user setting', () => {
    platform._platforms = ['ios'];
    config.init({
      tabsPlacement: 'top'
    }, qp, platform);

    expect(config.get('tabsPlacement')).toEqual('top');
  });

  it('should get setting from md mode', () => {
    platform._platforms = ['android'];
    config.init(null, qp, platform);

    expect(config.get('iconMode')).toEqual('md');
  });

  it('should get setting from ios mode', () => {
    platform._platforms = ['ios'];
    config.init(null, qp, platform);

    expect(config.get('tabsPlacement')).toEqual('bottom');
  });

  it('should set/get platform setting from set()', () => {
    platform._platforms = ['ios'];
    config.init(null, qp, platform);

    config.set('tabsPlacement', 'bottom');
    config.set('ios', 'tabsPlacement', 'top');

    expect(config.get('tabsPlacement')).toEqual('top');
  });

  it('should set/get setting from set()', () => {
    platform._platforms = ['ios'];
    config.init(null, qp, platform);

    config.set('tabsPlacement', 'top');

    expect(config.get('tabsPlacement')).toEqual('top');
  });

  it('should set ios platform settings from settings()', () => {
    platform._platforms = ['ios'];
    config.init(null, qp, platform);

    config.settings('ios', {
      key: 'iosValue'
    });

    expect(config.get('key')).toEqual('iosValue');
  });

  it('should set/get mobile setting even w/ higher priority ios', () => {
    platform._platforms = ['mobile', 'ios'];

    config.init({
      key: 'defaultValue',
      platforms: {
        mobile: {
          key: 'mobileValue'
        }
      }
    }, qp, platform);

    expect(config.get('key')).toEqual('mobileValue');
  });

  it('should set/get mobile setting even w/ higher priority ios', () => {
    platform._platforms = ['mobile', 'ios'];

    config.init({
      key: 'defaultValue',
      platforms: {
        mobile: {
          key: 'mobileValue'
        }
      }
    }, qp, platform);

    expect(config.get('key')).toEqual('mobileValue');
  });

  it('should set/get android setting w/ higher priority than mobile', () => {
    platform._platforms = ['mobile', 'android'];
    config.init({
      key: 'defaultValue',
      platforms: {
        mobile: {
          key: 'mobileValue'
        },
        android: {
          key: 'androidValue'
        }
      }
    }, qp, platform);

    expect(config.get('key')).toEqual('androidValue');
  });

  it('should set/get ios setting w/ platforms set', () => {
    platform._platforms = ['ios'];
    config.init(null, qp, platform);

    config.settings({
      key: 'defaultValue',
      platforms: {
        ios: {
          key: 'iosValue'
        },
        android: {
          key: 'androidValue'
        }
      }
    });

    expect(config.get('key')).toEqual('iosValue');
  });

  it('should set/get default setting w/ platforms set, but no platform match', () => {
    config.settings({
      key: 'defaultValue',
      platforms: {
        ios: {
          key: 'iosValue'
        },
        android: {
          key: 'androidValue'
        }
      }
    });

    expect(config.get('key')).toEqual('defaultValue');
  });

  it('should set setting object', () => {
    config.settings({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });

    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should get null setting', () => {
    config.init(null, null, null);
    expect(config.get('name')).toEqual(null);
    expect(config.get('name')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
  });

  it('should set/get single setting', () => {
    config.init(null, null, null);
    config.set('name', 'Doc Brown');
    config.set('occupation', 'Weather Man');

    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should init w/ given config settings', () => {
    config.init({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    }, null, null);
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should get a fallback value', () => {
    config.init({
      name: 'Doc Brown'
    }, null, null);
    expect(config.get('name', 'Marty')).toEqual('Doc Brown');
    expect(config.get('occupation', 'Weather Man')).toEqual('Weather Man');
  });

  it('should get a boolean value with a boolean config value', () => {
    config.init({
      key1: true,
      key2: false
    }, null, null);
    expect(config.getBoolean('key1')).toEqual(true);
    expect(config.getBoolean('key2')).toEqual(false);
  });

  it('should get a boolean value with a string config value', () => {
    config.init({
      key1: 'true',
      key2: 'false',
      key3: 'whatever'
    }, null, null);
    expect(config.getBoolean('key1')).toEqual(true);
    expect(config.getBoolean('key2')).toEqual(false);
    expect(config.getBoolean('key3')).toEqual(false);
    expect(config.getBoolean('key4')).toEqual(false);
    expect(config.getBoolean('key5', true)).toEqual(true);
  });

  it('should get a boolean value with a number config value', () => {
    config.init({
      key1: 0,
      key2: 1,
      key3: 'whatever'
    }, null, null);
    expect(config.getBoolean('key1')).toEqual(false);
    expect(config.getBoolean('key2')).toEqual(true);
  });

  it('should get a number value with a number config value', () => {
    config.init({
      key: 6
    }, null, null);
    expect(config.getNumber('key')).toEqual(6);
  });

  it('should get a number value with a string config value', () => {
    config.init({
      key: '6',
      numThenString: '6baymax',
      stringThenNum: 'baymax6'
    }, null, null);
    expect(config.getNumber('key', 5)).toEqual(6);
    expect(config.getNumber('numThenString', 4)).toEqual(6);
    expect( isNaN(config.getNumber('stringThenNum')) ).toEqual(true);
  });

  it('should get a number NaN value with a NaN config value', () => {
    config.init({
      allString: 'allstring',
      imNull: null,
      imUndefined: undefined
    }, null, null);
    expect( isNaN(config.getNumber('notfound'))).toEqual(true);
    expect( isNaN(config.getNumber('allString'))).toEqual(true);
    expect( isNaN(config.getNumber('imNull'))).toEqual(true);
    expect( isNaN(config.getNumber('imUndefined'))).toEqual(true);
  });

  it('should get a number fallback value with a NaN config value', () => {
    config.init({
      allString: 'allstring',
      imNull: null,
      imUndefined: undefined
    }, null, null);
    expect( config.getNumber('notfound', 6)).toEqual(6);
    expect( config.getNumber('allString', 6)).toEqual(6);
    expect( config.getNumber('imNull', 6)).toEqual(6);
    expect( config.getNumber('imUndefined', 6)).toEqual(6);

  });

  it('should get settings object', () => {
    config.init({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    }, null, null);

    expect(config.settings()).toEqual({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
  });

  it('should create default config w/ bad settings value', () => {
    let config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});

    config = new Config();
    config.init(null, null, null);
    expect(config.settings()).toEqual({});
  });

  let platform: Platform;
  let config: Config;
  let qp: QueryParams;

  beforeEach(() => {
    config = new Config();
    registerModeConfigs(config)();
    qp = new QueryParams('');
    platform = new Platform();
    platform.setPlatformConfigs(PLATFORM_CONFIGS);
  });

});
