
/*

 iOS 7.1 Cordova with AND without viewport height DOES resize, DOES NOT fire resize event
 iOS 7.1 Safari with AND without viewport height DOES NOT resize

 iOS 7.0 Cordova with viewport height DOES resize, DOES fire resize event
 iOS 7.0 Cordova without viewport height DOES resize, DOES NOT fire resize event
 iOS 7.0 Safari with AND without viewport height DOES NOT resize

 iOS 6.1 Cordova with AND without viewport height DOES NOT resize
 iOS 6.1 Safari without viewport height DOES NOT resize

 NOTES:
   - iOS 7.1 Safari with viewport height screws up ionic layout
   - iOS 7.0 Safari with viewport height, the scroll view does not resize properly on keyboardhide
   - iOS 7.0 Cordova without viewport height, scroll view does not resize properly switching inputs at bottom of page
   - iOS 6.1 Cordova and Safari don't work well with viewport height
   - If its not a webview, and a viewport height was set, just removing
     the height value doesn't trigger the change, but setting height=0 does the trick

 RECOMMENDATIONS:
   -iOS 7.1 Cordova no viewport height, keyboard is not over webview
   -iOS 7.1 Safari no viewport height, keyboard is over webview

   -iOS 7.0 Cordova yes viewport height, keyboard is not over webview
   -iOS 7.0 Safari no viewport height, keyboard is over webview

   -iOS 6.1 Cordova no viewport height, keyboard is over webview
   -iOS 6.1 Safari no viewport height, keyboard is over webview

  http://cordova.apache.org/docs/en/3.3.0/guide_platforms_ios_upgrading.md.html#Upgrading%20iOS
  https://issues.apache.org/jira/browse/CB-4323

*/


describe('Ionic Viewport', function() {
  var window, vportTag;

  beforeEach(inject(function($window) {
    window = $window;
    window._setTimeout = window.setTimeout;
    window.setTimeout = function(){};
    _activeElement = null; // the element which has focus
    window.cordova = undefined;
    window.device = undefined;
    window.navigator = {};
    window.innerWidth = 1;
    window.innerHeight = 2;
    ionic.Platform.ua = '';
    ionic.Platform.platforms = null;
    ionic.Platform.setPlatform('');
    ionic.Platform.setVersion('');
    ionic.keyboard.isOpen = false;
    viewportProperties = {};

    vportTag = document.createElement('meta');
    vportTag.setAttribute('name', 'viewport');
    document.head.appendChild(vportTag);
  }));

  afterEach(function(){
    window.setTimeout = window._setTimeout;
    if(vportTag) vportTag.parentNode.removeChild(vportTag);
  });



  // iOS 7.1, iPad, WebView

  it('Should remove width and height from viewport for iOS >= 7.1, iPad, WebView', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.1');
    window.cordova = {};

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no');
  });


  // iOS 7.1, iPad, Browser

  it('Should remove width and height from viewport for iOS >= 7.1, iPad, Browser', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.1');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no');
  });


  // iOS 7.0, iPad, WebView

  it('Should keep width and height in viewport for iOS 7.0, iPad, WebView, Portrait', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.0');
    window.cordova = {};
    window.innerWidth = 1;
    window.innerHeight = 2;

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=device-height');
  });

  it('Should add width and height to viewport for iOS 7.0, iPad, WebView, Portrait', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.0');
    window.cordova = {};
    window.innerWidth = 1;
    window.innerHeight = 2;

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=device-height');
  });

  it('Should add width and height=0 to viewport for iOS 7.0, iPad, WebView, Landscape', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.0');
    window.cordova = {};
    window.innerWidth = 2;
    window.innerHeight = 1;

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });

  it('Should keep width reset height to 0 in viewport for iOS 7.0, iPad, WebView, Landscape', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.0');
    window.cordova = {};
    window.innerWidth = 2;
    window.innerHeight = 1;

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });


  // iOS 7.0, iPad, Browser

  it('Should keep width, but remove height from viewport for iOS 7.0, iPad, Browser', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.0');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should add width, but not add height to viewport for iOS 7.0, iPad, Browser', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('7.0');

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });


  // iOS 6.1, iPad, WebView

  it('Should keep width, but remove height from viewport for iOS 6.1, iPad, WebView, Portrait', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('6.1');
    window.cordova = {};
    window.innerWidth = 1;
    window.innerHeight = 2;

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should add width, but not add height to viewport for iOS 6.1, iPad, WebView, Portrait', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('6.1');
    window.cordova = {};
    window.innerWidth = 1;
    window.innerHeight = 2;

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should keep width, but replace height with 0 in viewport for iOS 6.1, iPad, WebView, Landscape', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('6.1');
    window.cordova = {};
    window.innerWidth = 2;
    window.innerHeight = 1;

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });

  it('Should add width and add height=0 to viewport for iOS 6.1, iPad, WebView, Landscape', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('6.1');
    window.cordova = {};
    window.innerWidth = 2;
    window.innerHeight = 1;

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });


  // iOS 6.1, iPad, Browser

  it('Should keep width, and set height=0 for viewport for iOS 6.1, iPad, Browser, Portrait', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('6.1');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });

  it('Should add width, and add height=0 to viewport for iOS 6.1, iPad, Browser', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'ipad';
    ionic.Platform.setVersion('6.1');

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });


  // iOS 7.1, iPhone, WebView

  it('Should remove width and height from viewport for iOS 7.1, iPhone, WebView', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.setVersion('7.1');
    window.cordova = {};

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no');
  });

  it('Should do nothing width and height already in viewport for iOS 7.1, iPhone, WebView', function(){
    ionic.Platform.setPlatform('ios');
    ionic.Platform.setVersion('7.1');
    window.cordova = {};

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no');
  });


  // iOS 7.1, iPhone, Browser

  it('Should keep width, but remove height from viewport for iOS >= 7.1, iPhone, Browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.1');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should add width, but not height to viewport for iOS >= 7.1, iPhone, Browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.1');

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });


  // iOS 7.0, iPhone, WebView

  it('Should keep width, but not height in viewport for iOS 7.0, iPhone, WebView', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0');
    window.cordova = {};

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=device-height');
  });

  it('Should add width and height to viewport for iOS 7.0, iPhone, WebView', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0');
    window.cordova = {};

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=device-height');
  });


  // iOS 7.0, iPhone, Browser

  it('Should keep width but remove height from viewport for iOS 7.0, iPhone, Browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should add width but not height to viewport for iOS 7.0, iPhone, Browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0');

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });


  // iOS 6.1, iPhone, WebView

  it('Should add width but not height to viewport for iOS 6.1, iPhone, WebView', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('6.1');
    window.cordova = {};

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should keep width but replace height=device-height with height=0 in viewport for iOS 6.1, iPhone, WebView', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('6.1');
    window.cordova = {};

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });


  // iOS 6.1, iPhone, Browser

  it('Should add width but not height to viewport for iOS 6.1, iPhone, Browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('6.1');

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should keep width but remove height from viewport for iOS 6.1, iPhone, Browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('6.1');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width, height=0');
  });


  // Android 4.4, WebView

  it('Should add width, but not height to viewport for Android 4.4, WebView', function(){
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.4');
    window.cordova = {};

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should keep width, but remove height from viewport for Android 4.4, WebView', function(){
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.4');
    window.cordova = {};

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });


  // Android 4.4, Browser

  it('Should add width, but not height to viewport for Android 4.4, Browser', function(){
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.4');

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should keep width, but remove height from viewport for Android 4.4, Browser', function(){
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.4');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });


  // Standard Browser

  it('Should add width, but not height to viewport for Standard Browser', function(){
    ionic.Platform.ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36';

    vportTag.content = 'user-scalable=no';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });

  it('Should keep width, but remove height from viewport for Standard Browser', function(){
    ionic.Platform.setPlatform('android');
    ionic.Platform.setVersion('4.4');

    vportTag.content = 'user-scalable=no, width=device-width, height=device-height';
    viewportLoadTag();

    expect( vportTag.content ).toEqual('user-scalable=no, width=device-width');
  });



  it('Should set viewport properties that have a key but without a value', function(){
    vportTag.content = '   keyonly,   , ,,  WIDTH=DeViCe-wIDTH , minimal-ui    ';
    viewportLoadTag();

    expect( viewportProperties.keyonly ).toEqual('_');
    expect( viewportProperties.width ).toEqual('device-width');
    expect( viewportProperties['minimal-ui'] ).toEqual('_');

    viewportTagUpdate();
    expect( vportTag.content ).toEqual('keyonly, width=device-width, minimal-ui');
  });

  it('Should get portrait (0) orientation', function(){
    window.innerWidth = 768;
    window.innerHeight = 1024;
    expect( ionic.viewport.orientation() ).toEqual(0);

    window.innerWidth = 500;
    window.innerHeight = 500;
    expect( ionic.viewport.orientation() ).toEqual(0);
  });

  it('Should get landscape (90) orientation', function(){
    window.innerWidth = 1024;
    window.innerHeight = 768;
    expect( ionic.viewport.orientation() ).toEqual(90);
  });

});
