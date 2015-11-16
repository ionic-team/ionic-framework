import {Config, Platform, ionicProviders} from 'ionic/ionic';

export function run() {

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
    platform.url('http://biff.com/?ionicanimate=true')
    config.setPlatform(platform);
    expect(config.get('animate')).toEqual(true);

    config = new Config();
    platform = new Platform();
    platform.url('http://biff.com/?ionicanimate=false')
    config.setPlatform(platform);
    expect(config.get('animate')).toEqual(false);
  });

  it('should get value from case insensitive querystring key', () => {
    let config = new Config({
      mode: 'a'
    });
    let platform = new Platform();
    platform.url('http://biff.com/?ionicConfigKey=b')
    config.setPlatform(platform);

    expect(config.get('configKey')).toEqual('b');
  });

  it('should get value from querystring', () => {
    let config = new Config({
      mode: 'modeA'
    });
    let platform = new Platform();
    platform.url('http://biff.com/?ionicmode=modeB')
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

  it('should get md mode for windowsphone platform', () => {
    let config = new Config();
    let platform = new Platform(['mobile', 'windowsphone']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
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
