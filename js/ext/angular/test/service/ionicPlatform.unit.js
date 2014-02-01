describe('Ionic Platform Service', function() {
  var window;

  beforeEach(inject(function($window) {
    window = $window;
  }));

  it('should set platform name', function() {
    ionic.Platform.setPlatform('Android');
    expect(ionic.Platform.platform()).toEqual('Android');

    ionic.Platform.setPlatform('iOS');
    expect(ionic.Platform.platform()).toEqual('iOS');

    ionic.Platform.setPlatform('wInDoWs');
    expect(ionic.Platform.platform()).toEqual('wInDoWs');

    ionic.Platform.setPlatform('');
    expect(ionic.Platform.platform()).toEqual(undefined);

    ionic.Platform.setPlatform();
    expect(ionic.Platform.platform()).toEqual(undefined);
  });

  it('set version', function() {
    ionic.Platform.setVersion('1.2.3');
    expect(ionic.Platform.version()).toEqual(1.2);

    ionic.Platform.setVersion('1.2');
    expect(ionic.Platform.version()).toEqual(1.2);

    ionic.Platform.setVersion('1');
    expect(ionic.Platform.version()).toEqual(1.0);

    ionic.Platform.setVersion(' ');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion('me-not-number');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion('');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion(null);
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion();
    expect(ionic.Platform.version()).toEqual(0);
  });

  it('is iOS', function() {
    ionic.Platform.setPlatform('iOS');
    expect(ionic.Platform.isIOS()).toEqual(true);

    ionic.Platform.setPlatform('ios');
    expect(ionic.Platform.isIOS()).toEqual(true);

    ionic.Platform.setPlatform('Android');
    expect(ionic.Platform.isIOS()).toEqual(false);
  });

  it('is Android', function() {
    ionic.Platform.setPlatform('Android');
    expect(ionic.Platform.isAndroid()).toEqual(true);

    ionic.Platform.setPlatform('android');
    expect(ionic.Platform.isAndroid()).toEqual(true);

    ionic.Platform.setPlatform('ios');
    expect(ionic.Platform.isAndroid()).toEqual(false);
  });

  it('is Cordova', function() {
    expect(ionic.Platform.isCordova()).toEqual(false);
    window.cordova = {};
    expect(ionic.Platform.isCordova()).toEqual(true);
    delete window.cordova;
    window.PhoneGap = {};
    expect(ionic.Platform.isCordova()).toEqual(true);
    delete window.phonegap;
    window.phonegap = {};
    expect(ionic.Platform.isCordova()).toEqual(true);
  });

  it('sets ios platforms', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.9.3');
    
    ionic.Platform._checkPlatforms()

    expect(ionic.Platform.platforms[0]).toEqual('cordova');
    expect(ionic.Platform.platforms[1]).toEqual('ios');
    expect(ionic.Platform.platforms[2]).toEqual('ios7');
    expect(ionic.Platform.platforms[3]).toEqual('ios7_9');
  });

  it('sets android platforms', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.2.3');
    
    ionic.Platform._checkPlatforms()

    expect(ionic.Platform.platforms[0]).toEqual('cordova');
    expect(ionic.Platform.platforms[1]).toEqual('android');
    expect(ionic.Platform.platforms[2]).toEqual('android4');
    expect(ionic.Platform.platforms[3]).toEqual('android4_2');
  });

  it('is android', function() {
    ionic.Platform.setPlatform('AnDrOiD');
    expect(ionic.Platform.is('android')).toEqual(true);
    ionic.Platform.setPlatform('ANDROID');
    expect(ionic.Platform.is('android')).toEqual(true);
    ionic.Platform.setPlatform('android');
    expect(ionic.Platform.is('android')).toEqual(true);
    ionic.Platform.setPlatform('ios');
    expect(ionic.Platform.is('android')).toEqual(false);
  });

  it('is android', function() {
    ionic.Platform.setPlatform('iOs');
    expect(ionic.Platform.is('ios')).toEqual(true);
    ionic.Platform.setPlatform('iOs');
    expect(ionic.Platform.is('IOS')).toEqual(true);
    ionic.Platform.setPlatform('IOS');
    expect(ionic.Platform.is('ios')).toEqual(true);
    ionic.Platform.setPlatform('IOS');
    expect(ionic.Platform.is('android')).toEqual(false);
  });

});
