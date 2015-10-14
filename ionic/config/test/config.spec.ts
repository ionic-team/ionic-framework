import {IonicConfig, IonicPlatform, ionicProviders} from 'ionic/ionic';

export function run() {

  it('should create a new IonicConfig instace when no confg passed in ionicProviders', () => {
    let providers = ionicProviders();

    let config = providers.find(provider => provider.useValue instanceof IonicConfig).useValue;

    expect(config.get('mode')).toEqual('ios');
  });

  it('should used passed in IonicConfig instance in ionicProviders', () => {
    let userConfig =  new IonicConfig({
      mode: 'configInstance'
    })
    let providers = ionicProviders(userConfig);

    let config = providers.find(provider => provider.useValue instanceof IonicConfig).useValue;

    expect(config.get('mode')).toEqual('configInstance');
  });

  it('should create new IonicConfig instance from config object in ionicProviders', () => {
    let providers = ionicProviders({
      mode: 'configObj'
    });

    let config = providers.find(provider => provider.useValue instanceof IonicConfig).useValue;

    expect(config.get('mode')).toEqual('configObj');
  });

  it('should override mode settings', () => {
    let config = new IonicConfig({
      mode: 'md'
    });
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should override mode settings from platforms setting', () => {
    let config = new IonicConfig({
      platforms: {
        ios: {
          mode: 'md'
        }
      }
    });
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should override mode platform', () => {
    let config = new IonicConfig({
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
    let platform = new IonicPlatform(['mobile']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('modeB');
  });

  it('should override mode', () => {
    let config = new IonicConfig({
      mode: 'modeA'
    });
    let platform = new IonicPlatform(['core']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('modeA');
  });

  it('should get user settings after user platform settings', () => {
    let config = new IonicConfig({
      hoverCSS: true
    });
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    expect(config.get('hoverCSS')).toEqual(true);
  });

  it('should get ios mode for core platform', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['core']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('ios');
  });

  it('should get ios mode for ipad platform', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['mobile', 'ios', 'ipad', 'tablet']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('ios');
  });

  it('should get md mode for windowsphone platform', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['mobile', 'windowsphone']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
  });

  it('should get md mode for android platform', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['mobile', 'android']);
    config.setPlatform(platform);

    expect(config.get('mode')).toEqual('md');
  });

  it('should override ios mode config with user platform setting', () => {
    let config = new IonicConfig({
      tabBarPlacement: 'hide',
      platforms: {
        ios: {
          tabBarPlacement: 'top'
        }
      }
    });
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should override ios mode config with user setting', () => {
    let config = new IonicConfig({
      tabBarPlacement: 'top'
    });
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should get setting from md mode', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['android']);
    config.setPlatform(platform);

    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should get setting from ios mode', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    expect(config.get('tabBarPlacement')).toEqual('bottom');
  });

  it('should set/get platform setting from set()', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    config.set('tabBarPlacement', 'bottom');
    config.set('ios', 'tabBarPlacement', 'top');

    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should set/get setting from set()', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    config.set('tabBarPlacement', 'top');

    expect(config.get('tabBarPlacement')).toEqual('top');
  });

  it('should set ios platform settings from settings()', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['ios']);
    config.setPlatform(platform);

    config.settings('ios', {
      key: 'iosValue'
    });

    expect(config.get('key')).toEqual('iosValue');
  });

  it('should set/get mobile setting even w/ higher priority ios', () => {
    let config = new IonicConfig();
    let platform = new IonicPlatform(['mobile', 'ios']);
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
    let config = new IonicConfig();
    let platform = new IonicPlatform(['mobile', 'ios']);
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
    let config = new IonicConfig();
    let platform = new IonicPlatform(['mobile', 'android']);
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
    let config = new IonicConfig();
    let platform = new IonicPlatform(['ios']);
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
    let config = new IonicConfig();
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
    let config = new IonicConfig();
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
    let config = new IonicConfig();

    expect(config.get('name')).toEqual(null);
    expect(config.get('name')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
    expect(config.get('occupation')).toEqual(null);
  });

  it('should set/get single setting', () => {
    let config = new IonicConfig();
    config.set('name', 'Doc Brown');
    config.set('occupation', 'Weather Man');

    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should init w/ given config settings', () => {
    let config = new IonicConfig({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
    expect(config.get('name')).toEqual('Doc Brown');
    expect(config.get('occupation')).toEqual('Weather Man');
  });

  it('should get settings object', () => {
    let config = new IonicConfig({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });

    expect(config.settings()).toEqual({
      name: 'Doc Brown',
      occupation: 'Weather Man'
    });
  });

  it('should create default config w/ bad settings value', () => {
    let config = new IonicConfig(null);
    expect(config.settings()).toEqual({});

    config = new IonicConfig(undefined);
    expect(config.settings()).toEqual({});

    config = new IonicConfig();
    expect(config.settings()).toEqual({});

    config = new IonicConfig([1,2,3]);
    expect(config.settings()).toEqual({});

    config = new IonicConfig('im bad, you know it');
    expect(config.settings()).toEqual({});

    config = new IonicConfig(8675309);
    expect(config.settings()).toEqual({});

    config = new IonicConfig(true);
    expect(config.settings()).toEqual({});

    config = new IonicConfig(false);
    expect(config.settings()).toEqual({});

    config = new IonicConfig(1);
    expect(config.settings()).toEqual({});

    config = new IonicConfig(function(){});
    expect(config.settings()).toEqual({});
  });

}
