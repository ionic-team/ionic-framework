
/*

 iOS 7.1 Cordova with AND without viewport height DOES resize, DOES NOT fire resize event
 iOS 7.1 Safari with AND without viewport height DOES NOT resize

 iOS 7.0 Cordova with viewport height DOES resize, DOES fire resize event
 iOS 7.0 Cordova without viewport height DOES resize, DOES NOT fire resize event
 iOS 7.0 Safari with AND without viewport height DOES NOT resize

 iOS 6.1 Cordova with AND without viewport height DOES NOT resize
 iOS 6.1 Safari without viewport height DOES NOT resize

 NOTES:
   -iOS 7.1 Safari with viewport height screws up ionic layout
   -iOS 7.0 Safari with viewport height, the scroll view does not resize properly on keyboardhide
   -iOS 7.0 Cordova without viewport height, scroll view does not resize properly switching inputs at bottom of page
   -iOS 6.1 Cordova and Safari don't work well with viewport height

 RECOMMENDATIONS:
   -iOS 7.1 Cordova no viewport height, keyboard is not over webview
   -iOS 7.1 Safari no viewport height, keyboard is over webview

   -iOS 7.0 Cordova yes viewport height, keyboard is not over webview
   -iOS 7.0 Safari no viewport height, keyboard is over webview

   -iOS 6.1 Cordova no viewport height, keyboard is over webview
   -iOS 6.1 Safari no viewport height, keyboard is over webview

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

  it('Should have height=device-height for iOS 7+ on webview', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0');
    expect( ionic.Platform.isAndroid() ).toEqual(false);
    expect( ionic.Platform.isIOS() ).toEqual(true);

    //so isWebView() is true
    window.cordova = {};

    viewportLoadTag();
    expect( viewportProperties.height ).toEqual('device-height');
  });

  it('Should not have height=device-height for iOS 7+ on browser', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.Platform.setVersion('7.0');
    expect( ionic.Platform.isAndroid() ).toEqual(false);
    expect( ionic.Platform.isIOS() ).toEqual(true);

    viewportLoadTag();
    expect( viewportProperties.height ).not.toEqual('device-height');
  });

  it('Should have height=device-height for Android on webview', function(){
    ionic.Platform.setPlatform('Android');
    expect( ionic.Platform.isAndroid() ).toEqual(true);
    expect( ionic.Platform.isIOS() ).toEqual(false);

    //so isWebView() is true
    window.cordova = {};

    viewportLoadTag();
    expect( viewportProperties.height ).toEqual('device-height');
  });

  it('Should not have height=device-height for Android on browser', function(){
    ionic.Platform.setPlatform('Android');
    expect( ionic.Platform.isAndroid() ).toEqual(true);
    expect( ionic.Platform.isIOS() ).toEqual(false);

    viewportLoadTag();
    expect( viewportProperties.height ).not.toEqual('device-height');
  });

  it('Should not re-add height=device-height for webview if its already there', function(){
    ionic.Platform.setPlatform('ios');
    window.cordova = {};
    var originalViewport = '  initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width, height=device-height  ';
    vportTag.setAttribute('content', originalViewport);
    viewportLoadTag();

    // if it was changed the spaces would have been removed
    expect( vportTag.content ).toEqual(originalViewport);
  });

  it('Should not update the viewport if its not a webview and height=device-height wasnt already in', function(){
    ionic.Platform.setPlatform('ios');
    var originalViewport = '  initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width  ';
    vportTag.setAttribute('content', originalViewport);
    viewportLoadTag();

    // if it was changed the spaces would have been removed
    expect( vportTag.content ).toEqual(originalViewport);
  });

});
