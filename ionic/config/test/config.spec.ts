import {Config, Platform, ionicProviders} from '../../../ionic';

export function run() {

  it('should set activator setting to none for old Android Browser on a linux device', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUserAgent('Mozilla/5.0 (Linux; U; Android 4.2.2; nl-nl; GT-I9505 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30');
    platform.setNavigatorPlatform('linux');
    platform.load();
    config.setPlatform(platform);

    expect(config.get('activator')).toEqual('none');
  });

  it('should set activator setting to ripple for Android dev tools simulation on a mac', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUserAgent('Mozilla/5.0 (Linux; U; Android 4.2.2; nl-nl; GT-I9505 Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30');
    platform.setNavigatorPlatform('MacIntel');
    platform.load();
    config.setPlatform(platform);

    expect(config.get('activator')).toEqual('ripple');
  });

  it('should set activator setting to none for Android Chrome versions below v36 on a linux device', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUserAgent('Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1650.59 Mobile Safari/537.36');
    platform.setNavigatorPlatform('linux');
    platform.load();
    config.setPlatform(platform);

    expect(config.get('activator')).toEqual('none');
  });

  it('should set activator setting to ripple for Android Chrome v36 and above on a linux device', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUserAgent('Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1650.59 Mobile Safari/537.36');
    platform.setNavigatorPlatform('linux');
    platform.load();
    config.setPlatform(platform);

    expect(config.get('activator')).toEqual('ripple');
  });

  it('should set activator setting to ripple for Android v5.0 and above on a linux device not using Chrome', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUserAgent('Mozilla/5.0 (Android 5.0; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0');
    platform.setNavigatorPlatform('linux');
    platform.load();
    config.setPlatform(platform);

    expect(config.get('activator')).toEqual('ripple');
  });

  it('should set activator setting to none for Android versions below v5.0 on a linux device not using Chrome', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUserAgent('Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0');
    platform.setNavigatorPlatform('linux');
    platform.load();
    config.setPlatform(platform);

    expect(config.get('activator')).toEqual('none');
  });

  it('should create a new Config instace when no confg passed in ionicProviders', () => {
    let providers = ionicProviders();

    let config = providers.find(provider => provider.useValue instanceof Config).useValue;

    expect(config.get('mode')).toEqual('ios');
  });

  it('should used passed in Config instance in ionicProviders', () => {
    let userConfig =  new Config({
      mode: 'configInstance'
    })
    let providers = ionicProviders({config:userConfig});

    let config = providers.find(provider => provider.useValue instanceof Config).useValue;

    expect(config.get('mode')).toEqual('configInstance');
  });

  it('should create new Config instance from config object in ionicProviders', () => {
    let providers = ionicProviders({config: {
      mode: 'configObj'
    }});

    let config = providers.find(provider => provider.useValue instanceof Config).useValue;

    expect(config.get('mode')).toEqual('configObj');
  });

  it('should override mode settings', () => {
    let config = new Config({
      mode: 'md'
    });
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should override mode settings from platforms setting', () => {
    let config = new Config({
      platforms: {
        ios: {
          mode: 'md'
        }
      }
    });
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should get boolean value from querystring', () => {
    let config = new Config();
    let platform = new Platform();
    platform.setUrl('http://biff.com/?ionicanimate=true')
    config.setPlatform(platform);
    expect(config.get('animate')).toEqual(true);

    config = new Config();
    platform = new Platform();
    platform.setUrl('http://biff.com/?ionicanimate=false')
    config.setPlatform(platform);
    expect(config.get('animate')).toEqual(false);
  });

  it('should get value from case insensitive querystring key', () => {
    let config = new Config({
      mode: 'a'
    });
    let platform = new Platform();
    platform.setUrl('http://biff.com/?ionicConfigKey=b')
    config.setPlatform(platform);

    expect(config.get('configKey')).toEqual('b');
  });

  it('should get value from querystring', () => {
    let config = new Config({
      mode: 'modeA'
    });
    let platform = new Platform();
    platform.setUrl('http://biff.com/?ionicmode=modeB')
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('modeB');
  });

  it('should override mode platform', () => {
    let config = new Config({
      mode: 'modeA',
      platforms: {
        mobile: {
          mode: 'modeB'
        },
        ios: {
          mode: 'modeC'
        }
      }
    });
    let platform = new Platform(['mobile']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('modeB');
  });

  it('should override mode', () => {
    let config = new Config({
      mode: 'modeA'
    });
    let platform = new Platform(['core']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('modeA');
  });

  it('should get user settings after user platform settings', () => {
    let config = new Config({
      hoverCSS: true
    });
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    expect(config.get('hoverCSS')).toEqual(true);
  });

  it('should get ios mode for core platform', () => {
    let config = new Config();
    let platform = new Platform(['core']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('ios');
  });

  it('should get ios mode for ipad platform', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'ios', 'ipad', 'tablet']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('ios');
  });

  it('should get md mode for windows platform', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'windows']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('wp');
  });

  it('should get md mode for android platform', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'android']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
  });

  it('should override ios mode config with user platform setting', () => {
    let config = new Config({
      tabbarPlacement: 'hide',
      platforms: {
        ios: {
          tabbarPlacement: 'top'
        }
      }
    });
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should override ios mode config with user setting', () => {
    let config = new Config({
      tabbarPlacement: 'top'
    });
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should get setting from md mode', () => {
    let config = new Config();
    let platform = new Platform(['android']);
    config.setPlatform(platform);

    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should get setting from ios mode', () => {
    let config = new Config();
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    expect(config.get('tabbarPlacement')).toEqual('bottom');
  });

  it('should set/get platform setting from set()', () => {
    let config = new Config();
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    config.set('tabbarPlacement', 'bottom');
    config.set('ios', 'tabbarPlacement', 'top');

    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should set/get setting from set()', () => {
    let config = new Config();
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    config.set('tabbarPlacement', 'top');

    expect(config.get('tabbarPlacement')).toEqual('top');
  });

  it('should set ios platform settings from settings()', () => {
    let config = new Config();
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

    config.settings('ios', {
      key: 'iosValue'
    });

    expect(config.get('key')).toEqual('iosValue');
  });

  it('should set/get mobile setting even w/ higher priority ios', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'ios']);
    config.setPlatform(platform);

    config.settings({
      key: 'defaultValue',
      platforms: {
        mobile: {
          key: 'mobileValue'
        }
      }
    });

    expect(config.get('key')).toEqual('mobileValue');
  });

  it('should set/get mobile setting even w/ higher priority ios', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'ios']);
    config.setPlatform(platform);

    config.settings({
      key: 'defaultValue',
      platforms: {
        mobile: {
          key: 'mobileValue'
        }
      }
    });

    expect(config.get('key')).toEqual('mobileValue');
  });

  it('should set/get android setting w/ higher priority than mobile', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'android']);
    config.setPlatform(platform);

    config.settings({
      key: 'defaultValue',
      platforms: {
        mobile: {
          key: 'mobileValue'
        },
        android: {
          key: 'androidValue'
        }
      }
    });

    expect(config.get('key')).toEqual('androidValue');
  });

  it('should set/get ios setting w/ platforms set', () => {
    let config = new Config();
    let platform = new Platform(['ios']);
    config.setPlatform(platform);

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
    let config = new Config();
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
    let config = new Config();
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
    let config = new Config();

    expect(config.get('name')).toEqual(null);
    expect(config.get('name')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
  });

  it('should set/get single setting', () => {
    let config = new Config();
    config.set('name', 'Doc Brown');
    config.set('occupation', 'Weather Man');

    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should init w/ given config settings', () => {
    let config = new Config({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should get a fallback value', () => {
    let config = new Config({
      name: 'Doc Brown'
    });
    expect(config.get('name', 'Marty')).toEqual('Doc Brown');
    expect(config.get('occupation', 'Weather Man')).toEqual('Weather Man');
  });

  it('should get a boolean value with a boolean config value', () => {
    let config = new Config({
      key1: true,
      key2: false
    });
    expect(config.getBoolean('key1')).toEqual(true);
    expect(config.getBoolean('key2')).toEqual(false);
  });

  it('should get a boolean value with a string config value', () => {
    let config = new Config({
      key1: 'true',
      key2: 'false',
      key3: 'whatever'
    });
    expect(config.getBoolean('key1')).toEqual(true);
    expect(config.getBoolean('key2')).toEqual(false);
    expect(config.getBoolean('key3')).toEqual(false);
    expect(config.getBoolean('key4')).toEqual(false);
    expect(config.getBoolean('key5', true)).toEqual(true);
  });

  it('should get a boolean value with a number config value', () => {
    let config = new Config({
      key1: 0,
      key2: 1,
      key3: 'whatever'
    });
    expect(config.getBoolean('key1')).toEqual(false);
    expect(config.getBoolean('key2')).toEqual(true);
  });

  it('should get a number value with a number config value', () => {
    let config = new Config({
      key: 6
    });
    expect(config.getNumber('key')).toEqual(6);
  });

  it('should get a number value with a string config value', () => {
    let config = new Config({
      key: '6',
      numThenString: '6baymax',
      stringThenNum: 'baymax6'
    });
    expect(config.getNumber('key', 5)).toEqual(6);
    expect(config.getNumber('numThenString', 4)).toEqual(6);
    expect( isNaN(config.getNumber('stringThenNum')) ).toEqual(true);
  });

  it('should get a number NaN value with a NaN config value', () => {
    let config = new Config({
      allString: 'allstring',
      imNull: null,
      imUndefined: undefined
    });
    expect( isNaN(config.getNumber('notfound'))).toEqual(true);
    expect( isNaN(config.getNumber('allString'))).toEqual(true);
    expect( isNaN(config.getNumber('imNull'))).toEqual(true);
    expect( isNaN(config.getNumber('imUndefined'))).toEqual(true);
  });

  it('should get a number fallback value with a NaN config value', () => {
    let config = new Config({
      allString: 'allstring',
      imNull: null,
      imUndefined: undefined
    });
    expect( config.getNumber('notfound', 6)).toEqual(6);
    expect( config.getNumber('allString', 6)).toEqual(6);
    expect( config.getNumber('imNull', 6)).toEqual(6);
    expect( config.getNumber('imUndefined', 6)).toEqual(6);
  });

  it('should get settings object', () => {
    let config = new Config({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });

    expect(config.settings()).toEqual({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
  });

  it('should create default config w/ bad settings value', () => {
    let config = new Config(null);
    expect(config.settings()).toEqual({});

    config = new Config(undefined);
    expect(config.settings()).toEqual({});

    config = new Config();
    expect(config.settings()).toEqual({});

    config = new Config([1,2,3]);
    expect(config.settings()).toEqual({});

    config = new Config('im bad, you know it');
    expect(config.settings()).toEqual({});

    config = new Config(8675309);
    expect(config.settings()).toEqual({});

    config = new Config(true);
    expect(config.settings()).toEqual({});

    config = new Config(false);
    expect(config.settings()).toEqual({});

    config = new Config(1);
    expect(config.settings()).toEqual({});

    config = new Config(function(){});
    expect(config.settings()).toEqual({});
  });

}
