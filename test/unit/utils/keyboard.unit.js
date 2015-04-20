
/*

Physical Device Testing Scenarios
---------------------------------
- focusing inputs below the keyboard should scroll them into the middle of the view
- focusing inputs that are above the keyboard should not scroll, but still resize the scrollable content area
- focusing inputs should resize the scroll view so the user can scroll to inputs at the bottom of the page
- clicking the label of an input should focus that input
- focusing an input that is mostly offscreen should scroll into view using js scrolling, not the browser scrolling it into view
- focusing an input while another input already has focus should not (visibly) close and re-open the keyboard
- focusing an input that is above the keyboard while another input already has focus should not do anything
- focusing an input that is below the keyboard while another input already has focus should scroll it into view
- the header should not move when an input is focused
- entering an input on a popup or modal should resize and un-resize that scrollview
- opening a popup or a modal while the keyboard is up should un-resize the scrollview before opening the modal or popup
- changing the orientation of the device should not break any of the above^
- quickly tap different text inputs then end up tapping an element that isn't a text input, the scroll resize should go away

- focusing inputs at the bottom of the page should scroll into view normally (broken on iOS 7.0 w/o height meta tag)
- on iOS in safari, shrinking the view should account for the button-bar at the bottom (currently not working)

Tentative:
- height=device-height not needed on iOS 6.1
- height=device-height needed on iOS 7.0 Cordova
  ** without it, fires 4 resize events when the keyboard comes up, and the scroll view resizes incorrectly, with it, does not fire resize events? **
- height=device-height not needed on iOS 7.1


Tested On
-----------------------
- iOS 7.1 Safari
- iOS 7.1 Cordova
- iOS 7.0 Safari
- iOS 7.0 Cordova
- iOS 6.1 Safari
- iOS 6.1 Cordova
- Android 4.4 Browser
- Android 4.4 Cordova
- Android 4.2 Browser
- Android 4.2 Cordova


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

Notes:
---------------------------------
iOS 7 keyboard is 216px tall without the accessory bar
iOS 7 keyboard is 260px tall with the accessory bar

Switching inputs fires focusOut on iOS, doesn't on Android

*/


describe('Ionic Keyboard', function() {
  var scope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($rootScope, $compile) {
    window.cordova = undefined;
    window.device = undefined;

    scope = $rootScope;
    compile = $compile;

    ionic.Platform.ua = '';
    ionic.Platform.platforms = [];
    ionic.Platform.setPlatform('');
    ionic.Platform.setVersion('');
    ionic.Platform.isFullScreen = false;

    ionic.keyboard.isOpen = false;
    ionic.keyboard.isOpening = false;
    ionic.keyboard.isClosing = false;
    ionic.keyboard.height = 0;
    ionic.keyboard.isLandscape = false;

    keyboardActiveElement = undefined;
    keyboardCurrentViewportHeight = 0;
    keyboardPortraitViewportHeight = 0;
    keyboardLandscapeViewportHeight = 0;

    jasmine.Clock.useMock();
  }));

  it('keyboardWaitForResize should set ionic.keyboard.isOpen', function(){
    ionic.keyboard.isOpen = false;
    ionic.Platform.setPlatform('ios');
    keyboardWaitForResize(function(){}, true);
    jasmine.Clock.tick(100);
    expect(ionic.keyboard.isOpen).toBe(true);
    keyboardWaitForResize(function(){}, false);
    jasmine.Clock.tick(100);
    expect(ionic.keyboard.isOpen).toBe(false);
  });

  it('keyboardWaitForResize should set ionic.keyboard.height to the difference in window.innerHeight if not using plugin', function(){
    expect(keyboardHasPlugin()).toBe(false);
    expect(ionic.keyboard.isOpen).toBe(false);
    expect(ionic.keyboard.height).toBe(0);

    window.innerHeight = 568;

    //so we don't have to wait as long
    ionic.Platform.setPlatform("ios");

    keyboardWaitForResize(function(){}, false);
    window.innerHeight = 268;
    jasmine.Clock.tick(100);

    expect(window.innerHeight).toBe(268);
    expect(ionic.keyboard.height).toBe(300);
  });

  it('keyboardWaitForResize should call the specified callback', function(){
    //so we don't have to wait as long
    ionic.Platform.setPlatform('ios');

    var spy = jasmine.createSpy();

    keyboardWaitForResize(spy, false);
    jasmine.Clock.tick('100');

    expect(spy).toHaveBeenCalled();
  });

  it('keyboardWaitForResize maxCount should be 30 if Android and version < 4.4', function(){
    ionic.Platform.setPlatform('Android');
    ionic.Platform.setVersion('4.1');

    var maxCount = keyboardWaitForResize(function(){}, false);

    expect(maxCount).toBe(30);
  });

  it('keyboardWaitForResize maxCount should be 10 if Android and version >= 4.4', function(){
    ionic.Platform.setPlatform('Android');
    ionic.Platform.setVersion('4.4');

    var maxCount = keyboardWaitForResize(function(){}, false);

    expect(maxCount).toBe(10);
  });

  it('keyboardWaitForResize maxCount should be 1 if not Android', function(){
    ionic.Platform.setPlatform('ios');

    var maxCount = keyboardWaitForResize(function(){}, false);

    expect(maxCount).toBe(1);
  });

  it('keyboardHide should set ionic.keyboard.isOpen and ionic.keyboard.isClosing', function(){
    ionic.keyboard.isOpen = true;
    ionic.keyboard.isClosing = true;
    keyboardHide();
    expect(ionic.keyboard.isOpen).toBe(false);
    expect(ionic.keyboard.isClosing).toBe(false);
  });

  it('keyboardHide should reset the scroll view', function(){
    var element = compile('<ion-scroll><input></ion-scroll>')(scope);
    document.body.appendChild(element[0]);
    scope.$apply();
    var scrollView = element.controller('$ionicScroll').scrollView;
    spyOn(scrollView, 'resetScrollView');
    document.addEventListener('resetScrollView', scrollView.resetScrollView);
    keyboardActiveElement = element.find('input')[0];
    keyboardHide();
    document.removeEventListener('resetScrollView', scrollView.resetScrollView);
    expect(scrollView.resetScrollView).toHaveBeenCalled();
  });

  it('keyboardHide should blur the currently focused input on Android', function(){
    ionic.Platform.setPlatform('Android');

    var element = document.createElement('input');
    document.body.appendChild(element);
    element.focus();
    keyboardActiveElement = element;
    expect(document.activeElement == element).toBe(true);
    keyboardHide();
    expect(document.activeElement == element).toBe(false);
  });

  it('keyboardHide should call cordova.plugins.Keyboard.close if the plugin is available', function(){
    ionic.Platform.setPlatform('Android');
    cordova = {
      'plugins': {
        'Keyboard': {
          'close': function(){}
        }
      }
    };
    expect(keyboardHasPlugin()).toBe(true);
    spyOn(cordova.plugins.Keyboard, 'close');
    keyboardHide();
    expect(cordova.plugins.Keyboard.close).toHaveBeenCalled();
  });

  it('keyboardHide should remove KEYBOARD_OPEN_CSS from the body', function(){
    document.body.classList.add(KEYBOARD_OPEN_CSS);
    expect(document.body.classList.contains(KEYBOARD_OPEN_CSS)).toBe(true);
    var ionicRAF = ionic.requestAnimationFrame;
    ionic.requestAnimationFrame = function(cb){ cb(); };
    keyboardHide();
    ionic.requestAnimationFrame = ionicRAF;
    expect(document.body.classList.contains(KEYBOARD_OPEN_CSS)).toBe(false);
  });

  it('keyboardShow should set ionic.keyboard.isOpen and ionic.keyboard.isOpening', function(){
    ionic.keyboard.isOpen = false;
    ionic.keyboard.isOpening = true;
    keyboardActiveElement = document.createElement('input');
    keyboardShow();
    jasmine.Clock.tick(401);
    expect(ionic.keyboard.isOpen).toBe(true);
    expect(ionic.keyboard.isOpening).toBe(false);
  });

  it('keyboardShow should set details.windowHeight and details.isElementUnderKeyboard', function(){
    //element bounds will all be 0 since we aren't appending it to the body
    keyboardActiveElement = document.createElement('input');
    keyboardCurrentViewportHeight = 568;
    ionic.keyboard.height = 300;

    var details = keyboardShow();
    jasmine.Clock.tick(401);
    expect(details.elementBottom).toBe(0);
    expect(details.windowHeight).toBe(268);
    expect(details.isElementUnderKeyboard).toBe(false); // 0 < 267

    keyboardCurrentViewportHeight = 100;
    details = keyboardShow();
    jasmine.Clock.tick(401);
    expect(details.elementBottom).toBe(0);
    expect(details.windowHeight).toBe(-200);
    expect(details.isElementUnderKeyboard).toBe(true); // 0 > -200
  });

  it('keyboardShow should trigger scrollChildIntoview', function(){
    var element = compile('<ion-scroll><input></ion-scroll>')(scope);
    document.body.appendChild(element[0]);
    scope.$apply();
    var scrollView = element.controller('$ionicScroll').scrollView;
    spyOn(scrollView, 'scrollChildIntoView');
    scrollView.__container.addEventListener('scrollChildIntoView', scrollView.scrollChildIntoView);
    keyboardActiveElement = element.find('input')[0];
    keyboardShow();
    jasmine.Clock.tick(401);
    scrollView.__container.removeEventListener('scrollChildIntoView', scrollView.scrollChildIntoView);
    expect(scrollView.scrollChildIntoView).toHaveBeenCalled();
  });

  it('keyboardShow should add KEYBOARD_OPEN_CSS to the body', function(){
    document.body.classList.remove(KEYBOARD_OPEN_CSS);
    expect(document.body.classList.contains(KEYBOARD_OPEN_CSS)).toBe(false);
    keyboardActiveElement = document.createElement('input');
    keyboardShow();
    expect(document.body.classList.contains(KEYBOARD_OPEN_CSS)).toBe(false);
    jasmine.Clock.tick(401);
    expect(document.body.classList.contains(KEYBOARD_OPEN_CSS)).toBe(true);
  });

  it('Should keyboardHasPlugin', function() {
    expect(keyboardHasPlugin()).toEqual(false);

    window.cordova = {};
    expect(keyboardHasPlugin()).toEqual(false);

    window.cordova.plugins = {};
    expect(keyboardHasPlugin()).toEqual(false);

    window.cordova.plugins.Keyboard = {};
    expect(keyboardHasPlugin()).toEqual(true);
  });

  it('keyboardGetHeight should use the keyboard plugin if it is available', function(){
    ionic.keyboard.height = 216;
    expect(keyboardGetHeight()).toEqual(216);
  });

  it('keyboardGetHeight should = 275 if Cordova Android and is fullscreen', function(){
    ionic.Platform.setPlatform('android');
    window.cordova = {};
    ionic.Platform.isFullScreen = true;

    expect(ionic.Platform.isAndroid()).toBe(true);
    expect(ionic.Platform.isIOS()).toBe(false);
    expect(keyboardGetHeight()).toEqual(275);
  });

  it('keyboardGetHeight should = (keyboardCurrentViewportHeight - window.innerHeight) if Android and not fullscreen', function(){
    ionic.Platform.setPlatform('android');
    expect( ionic.Platform.isFullScreen ).toEqual(false);

    keyboardCurrentViewportHeight = 480;
    window.innerHeight = 280;

    expect(ionic.Platform.isAndroid()).toBe(true);
    expect(ionic.Platform.isIOS()).toBe(false);
    expect(keyboardGetHeight()).toEqual(200);
  });

  it('keyboardGetHeight should = 0 if keyboardCurrentViewportHeight = window.innerHeight and Android and not fullscreen', function(){
    ionic.Platform.setPlatform('android');
    expect(ionic.Platform.isFullScreen).toEqual(false);

    keyboardCurrentViewportHeight = 480;
    window.innerHeight = 480;

    expect(ionic.Platform.isAndroid()).toBe(true);
    expect(ionic.Platform.isIOS()).toBe(false);
    expect(keyboardGetHeight()).toEqual(0);
  });

  it('keyboardGetHeight should = 206 if iOS and in landscape orientation', function(){
    ionic.Platform.setPlatform('iOS');
    ionic.keyboard.isLandscape = true;

    expect(ionic.Platform.isAndroid()).toBe(false);
    expect(ionic.Platform.isIOS()).toBe(true);
    expect(ionic.keyboard.isLandscape).toBe(true);
    expect(keyboardGetHeight()).toEqual(206);
    expect(ionic.Platform.isAndroid()).toBe(false);
  });

  it('keyboardGetHeight should = 216 if iOS Safari', function(){
    ionic.Platform.setPlatform('iOS');

    expect(ionic.Platform.isWebView()).toEqual(false);
    expect(ionic.Platform.isAndroid()).toBe(false);
    expect(ionic.Platform.isIOS()).toBe(true);
    expect(keyboardGetHeight()).toEqual(216);
  });

  it('keyboardGetHeight should = 260 if iOS Cordova', function(){
    ionic.Platform.setPlatform('iOS');
    window.cordova = {};

    expect(ionic.Platform.isWebView()).toEqual(true);
    expect(ionic.Platform.isAndroid()).toBe(false);
    expect(ionic.Platform.isIOS()).toBe(true);
    expect(keyboardGetHeight()).toEqual(260);
  });

  it('keyboardGetHeight should = 275 if not Android or iOS', function(){
    ionic.Platform.setPlatform('WP8');

    expect(ionic.Platform.isAndroid()).toBe(false);
    expect(ionic.Platform.isIOS()).toBe(false);
    expect(keyboardGetHeight()).toEqual(275);
  });

  it('should isPortraitViewportHeight', function(){
    ionic.keyboard.isLandscape = true;
    expect(ionic.keyboard.isLandscape).toBe(true);
    expect(keyboardPortraitViewportHeight).toBe(0);

    expect(isPortraitViewportHeight(100)).toBe(false);
    expect(isPortraitViewportHeight(568)).toBe(false);

    keyboardPortraitViewportHeight = 568;
    expect(isPortraitViewportHeight(100)).toBe(false);
    expect(isPortraitViewportHeight(568)).toBe(false);

    ionic.keyboard.isLandscape = false;
    expect(isPortraitViewportHeight(100)).toBe(false);
    expect(isPortraitViewportHeight(568)).toBe(true);
  });

  it('should isLandscapeViewportHeight', function(){
    expect(ionic.keyboard.isLandscape).toBe(false);
    expect(keyboardLandscapeViewportHeight).toBe(0);

    expect(isLandscapeViewportHeight(100)).toBe(false);
    expect(isLandscapeViewportHeight(320)).toBe(false);

    keyboardLandscapeViewportHeight = 320;
    expect(isLandscapeViewportHeight(100)).toBe(false);
    expect(isLandscapeViewportHeight(320)).toBe(false);

    ionic.keyboard.isLandscape = true;
    expect(isLandscapeViewportHeight(100)).toBe(false);
    expect(isLandscapeViewportHeight(320)).toBe(true);
  });

  it('keyboardUpdateViewportHeight should set keyboardLandscapeViewportHeight if it isn\'t set and isLandscape', function(){
    expect(ionic.keyboard.isLandscape).toBe(false);
    expect(ionic.keyboard.isOpen).toBe(false);
    expect(keyboardLandscapeViewportHeight).toBe(0);
    ionic.keyboard.isLandscape = true;
    window.innerHeight = 320;
    keyboardUpdateViewportHeight();
    expect(keyboardLandscapeViewportHeight).toBe(320);
  });

  it('keyboardUpdateViewportHeight should set keyboardPortraitViewportHeight if it isn\'t set and !isLandscape', function(){
    expect(ionic.keyboard.isLandscape).toBe(false);
    expect(ionic.keyboard.isOpen).toBe(false);
    expect(keyboardPortraitViewportHeight).toBe(0);
    window.innerHeight = 568;
    keyboardUpdateViewportHeight();
    expect(keyboardPortraitViewportHeight).toBe(568);
  });

  it('keyboardUpdateViewportHeight should reset the scroll view', function(done){
    var element = compile('<ion-scroll><input></ion-scroll>')(scope);
    document.body.appendChild(element[0]);
    scope.$apply();
    var scrollView = element.controller('$ionicScroll').scrollView;
    spyOn(scrollView, 'resetScrollView');
    document.addEventListener('resetScrollView', scrollView.resetScrollView);
    keyboardActiveElement = element.find('input')[0];
    keyboardUpdateViewportHeight();
    document.removeEventListener('resetScrollView', scrollView.resetScrollView);
    expect(scrollView.resetScrollView).toHaveBeenCalled();
  });

  it('keyboardInitViewportHeight should set ionic.keyboard.isLandscape if viewportHeight / window.innerWidth < 1', function(){
    window.innerHeight = 320;
    window.innerWidth = 568;
    expect(ionic.keyboard.isLandscape).toBe(false);
    keyboardInitViewportHeight();
    expect(ionic.keyboard.isLandscape).toBe(true);
  });

  it('keyboardInitViewportHeight should set viewport values', function(){
    expect(ionic.keyboard.isLandscape).toBe(false);
    expect(ionic.keyboard.isOpen).toBe(false);
    expect(keyboardLandscapeViewportHeight).toBe(0);
    expect(keyboardPortraitViewportHeight).toBe(0);
    expect(keyboardCurrentViewportHeight).toBe(0);

    window.innerHeight = 568;
    window.innerWidth = 320;
    keyboardInitViewportHeight();
    expect(ionic.keyboard.isLandscape).toBe(false);
    expect(keyboardLandscapeViewportHeight).toBe(0);
    expect(keyboardPortraitViewportHeight).toBe(568);
    expect(keyboardCurrentViewportHeight).toBe(568);

    window.innerHeight = 320;
    window.innerWidth = 568;
    keyboardInitViewportHeight();
    expect(ionic.keyboard.isLandscape).toBe(true);
    expect(keyboardLandscapeViewportHeight).toBe(320);
    expect(keyboardPortraitViewportHeight).toBe(568);
    expect(keyboardCurrentViewportHeight).toBe(320);
  });

  it('should getViewportHeight', function(){
    ionic.keyboard.isOpen = true;
    ionic.keyboard.height = 300;
    window.innerHeight = 268;
    ionic.Platform.setPlatform('ios');

    expect(ionic.Platform.isAndroid()).toBe(false);
    expect(ionic.Platform.isFullScreen).toBe(false);
    expect(ionic.keyboard.isOpening).toBe(false);
    expect(ionic.keyboard.isClosing).toBe(false);
    expect(getViewportHeight()).toBe(568);

    ionic.keyboard.isOpen = false;
    ionic.keyboard.isOpening = true;
    expect(getViewportHeight()).toBe(568);

    ionic.keyboard.isOpen = true;
    ionic.keyboard.isClosing = true;
    expect(getViewportHeight()).toBe(268);

    ionic.keyboard.isClosing = false;
    ionic.Platform.setPlatform('android');
    expect(ionic.Platform.isIOS()).toBe(false);
    expect(getViewportHeight()).toBe(568);

    ionic.Platform.isFullScreen = true;
    expect(getViewportHeight()).toBe(268);
  });

  it('enable() should set isInitialized to true', function(){
    expect(ionic.keyboard.isInitialized).toBe(false);
    ionic.keyboard.enable();
    expect(ionic.keyboard.isInitialized).toBe(true);
  });

  it('disable() should set isInitialized to false', function(){
    expect(ionic.keyboard.isInitialized).toBe(true);
    ionic.keyboard.disable();
    expect(ionic.keyboard.isInitialized).toBe(false);
  });
});
