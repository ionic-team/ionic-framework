describe('Ionic Platform Service', function() {
  var window, ionicPlatform, rootScope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($window, $ionicPlatform, $rootScope) {
    window = $window;
    ionic.Platform.navigator = {
      platform: ''
    };
    ionic.Platform.ua = '';
    ionicPlatform = $ionicPlatform;
    rootScope = $rootScope;
    $ionicPlatform.$backButtonActions = {};
  }));

  it('should set platform name', function() {
    ionic.Platform.setPlatform('Android');
    expect(ionic.Platform.platform()).toEqual('android');

    ionic.Platform.setPlatform('iOS');
    expect(ionic.Platform.platform()).toEqual('ios');
  });

  it('set version with device', function() {
    ionic.Platform.setVersion('1.2.3');
    expect(ionic.Platform.version()).toEqual(1.2);

    ionic.Platform.setVersion('1.2');
    expect(ionic.Platform.version()).toEqual(1.2);

    ionic.Platform.setVersion('1');
    expect(ionic.Platform.version()).toEqual(1.0);

    ionic.Platform.setVersion('0.1');
    expect(ionic.Platform.version()).toEqual(0.1);

    ionic.Platform.setVersion(' ');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion('me-not-number');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion('');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion(null);
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion('0');
    expect(ionic.Platform.version()).toEqual(0);

    ionic.Platform.setVersion();
    expect(ionic.Platform.version()).toEqual(0);
  });

  it('set android with user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (Linux; U; Android 2.2.1; fr-ch; A43 Build/FROYO) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.platform()).toEqual('android');
    expect(ionic.Platform.version()).toEqual(2.2);
  });

  it('set windowsphone with user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch;';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.platform()).toEqual('windowsphone');
    expect(ionic.Platform.version()).toEqual(8);
  });

  it('set ios with iPhone user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.platform()).toEqual('ios');
    expect(ionic.Platform.version()).toEqual(6.1);
  });

  it('set ios with iPad user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.platform()).toEqual('ios');
    expect(ionic.Platform.version()).toEqual(7.0);
  });

  it('set ios with iPod user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (iPod touch; CPU OS 8_1_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B511 Safari/9537.53';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.platform()).toEqual('ios');
    expect(ionic.Platform.version()).toEqual(8.1);
  });

  it('should not be iPad from none iPad user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (iPhone; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.isIPad()).toEqual(false);
  });

  it('should be iPad from user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53';
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.isIPad()).toEqual(true);
  });

  it('should be iPad from iPad in ionic.Platform.navigator.platform and webview, but iPhone in user agent', function() {
    window.cordova = {};
    ionic.Platform.ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
    ionic.Platform.navigator = {
      platform: 'iPad Simulator'
    };
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.isIPad()).toEqual(true);
  });

  it('should not be iPad from no in ionic.Platform.navigator.platform, and iPhone in user agent', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25';
    ionic.Platform.navigator = {};
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.isIPad()).toEqual(false);
  });

  it('is not iOS', function() {
    ionic.Platform.ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36';
    ionic.Platform.navigator = {};
    ionic.Platform.setPlatform(undefined);
    ionic.Platform.setVersion(undefined);
    expect(ionic.Platform.isIOS()).toEqual(false);
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
  });

  it('is WebView', function() {
    window.cordova = undefined;
    expect(ionic.Platform.isWebView()).toEqual(false);
    window.cordova = {};
    expect(ionic.Platform.isWebView()).toEqual(true);
    delete window.cordova;
    window.PhoneGap = {};
    expect(ionic.Platform.isWebView()).toEqual(true);
    delete window.phonegap;
    window.phonegap = {};
    expect(ionic.Platform.isWebView()).toEqual(true);
  });

  it('sets ios platforms', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0.3');

    ionic.Platform._checkPlatforms();

    expect(ionic.Platform.platforms[0]).toEqual('webview');
    expect(ionic.Platform.platforms[1]).toEqual('cordova');
    expect(ionic.Platform.platforms[2]).toEqual('ios');
    expect(ionic.Platform.platforms[3]).toEqual('ios7');
    expect(ionic.Platform.platforms[4]).toEqual('ios7_0');
  });

  it('sets android platforms', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.2.3');

    ionic.Platform._checkPlatforms();

    expect(ionic.Platform.platforms[0]).toEqual('webview');
    expect(ionic.Platform.platforms[1]).toEqual('cordova');
    expect(ionic.Platform.platforms[2]).toEqual('android');
    expect(ionic.Platform.platforms[3]).toEqual('android4');
    expect(ionic.Platform.platforms[4]).toEqual('android4_2');
  });

  it('should only set the webview', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('');
    ionic.Platform.setVersion('');

    ionic.Platform._checkPlatforms();

    expect(ionic.Platform.platforms.length).toEqual(2);
    expect(ionic.Platform.platforms[0]).toEqual('webview');
    expect(ionic.Platform.platforms[1]).toEqual('cordova');
  });

  it('should not set if its not a webview but only a browser', function() {
    window.cordova = null;
    window.PhoneGap = null;
    window.phonegap = null;
    ionic.Platform.setPlatform('');
    ionic.Platform.setVersion('');

    ionic.Platform._checkPlatforms();

    expect(ionic.Platform.platforms[0]).toEqual('browser');
  });

  it('sets grade a from iOS7', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.1.1');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('a');
  });

  it('sets grade a from iOS6', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('6.1.1');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('a');
  });

  it('sets grade a from Android 4.4', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.4.1');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('a');
  });

  it('sets grade b from Android 4.3', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.3.1');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('b');
  });

  it('sets grade b from Android 4.0', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.0.0');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('b');
  });

  it('sets grade c from Android 3.0', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('3.0.0');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('c');
  });

  it('sets grade c from Android 2.3.4', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('2.3.4');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('c');
  });

  it('sets grade a from unknown android version', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('0');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('a');
  });

  it('sets grade b from Windows Phone platform', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('windowsphone');
    ionic.Platform.setVersion('8.0');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('b');
  });

  it('sets grade a from unknown platform', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('whatever');
    ionic.Platform.setVersion('20.3.4');
    ionic.Platform._checkPlatforms();
    expect(ionic.Platform.grade).toEqual('a');
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

  it('is iOS', function() {
    ionic.Platform.setPlatform('iOs');
    expect(ionic.Platform.is('ios')).toEqual(true);
    ionic.Platform.setPlatform('iOs');
    expect(ionic.Platform.is('IOS')).toEqual(true);
    ionic.Platform.setPlatform('IOS');
    expect(ionic.Platform.is('ios')).toEqual(true);
    ionic.Platform.setPlatform('IOS');
    expect(ionic.Platform.is('android')).toEqual(false);
  });

  it('should be all platforms for ios', function() {
    window.cordova = {};
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.1.4');
    ionic.Platform._checkPlatforms();

    expect(ionic.Platform.is('ios')).toEqual(true);
    expect(ionic.Platform.is('ios7')).toEqual(true);
    expect(ionic.Platform.is('ios7_1')).toEqual(true);
    expect(ionic.Platform.is('cordova')).toEqual(true);
    expect(ionic.Platform.is('android')).toEqual(false);
  });

  it('should register/deregister a hardware back button action and add it to $ionicPlatform.backButtonActions', function() {
    var deregisterFn = ionicPlatform.registerBackButtonAction(function(){});
    expect( Object.keys( ionicPlatform.$backButtonActions ).length ).toEqual(1);
    deregisterFn();
    expect( Object.keys( ionicPlatform.$backButtonActions ).length ).toEqual(0);
  });

  it('should register multiple back button actions and only call the highest priority on hardwareBackButtonClick', function() {
    ionicPlatform.registerBackButtonAction(function(){}, 1, 'action1');
    ionicPlatform.registerBackButtonAction(function(){}, 2, 'action2');
    ionicPlatform.registerBackButtonAction(function(){}, 3, 'action3');

    var rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp.priority).toEqual(3);
    expect(rsp.id).toEqual('action3');
  });

  it('should register multiple back button actions w/ the same priority and only call the last highest priority on hardwareBackButtonClick', function() {
    ionicPlatform.registerBackButtonAction(function(){}, 3, 'action1');
    ionicPlatform.registerBackButtonAction(function(){}, 3, 'action2');
    ionicPlatform.registerBackButtonAction(function(){}, 3, 'action3');

    var rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp.priority).toEqual(3);
    expect(rsp.id).toEqual('action3');
  });

  it('should register no back button actions and do nothing on hardwareBackButtonClick', function() {
    var rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp).toBeUndefined();
  });

  it('should register multiple back button actions, call hardwareBackButtonClick, deregister, and call hardwareBackButtonClick again', function() {
    var dereg1 = ionicPlatform.registerBackButtonAction(function(){}, 1, 'action1');
    var dereg2 = ionicPlatform.registerBackButtonAction(function(){}, 2, 'action2');
    var dereg3 = ionicPlatform.registerBackButtonAction(function(){}, 3, 'action3');

    var rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp.priority).toEqual(3);
    expect(rsp.id).toEqual('action3');

    dereg3();

    rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp.priority).toEqual(2);
    expect(rsp.id).toEqual('action2');

    dereg2();

    rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp.priority).toEqual(1);
    expect(rsp.id).toEqual('action1');

    dereg1();
    rsp = ionicPlatform.hardwareBackButtonClick();
    expect(rsp).toBeUndefined();
  });

});
