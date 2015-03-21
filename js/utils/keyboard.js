/**
 * @ngdoc page
 * @name keyboard
 * @module ionic
 * @description
 * On both Android and iOS, Ionic will attempt to prevent the keyboard from
 * obscuring inputs and focusable elements when it appears by scrolling them
 * into view.  In order for this to work, any focusable elements must be within
 * a [Scroll View](http://ionicframework.com/docs/api/directive/ionScroll/)
 * or a directive such as [Content](http://ionicframework.com/docs/api/directive/ionContent/)
 * that has a Scroll View.
 *
 * It will also attempt to prevent the native overflow scrolling on focus,
 * which can cause layout issues such as pushing headers up and out of view.
 *
 * The keyboard fixes work best in conjunction with the
 * [Ionic Keyboard Plugin](https://github.com/driftyco/ionic-plugins-keyboard),
 * although it will perform reasonably well without.  However, if you are using
 * Cordova there is no reason not to use the plugin.
 *
 * ### Hide when keyboard shows
 *
 * To hide an element when the keyboard is open, add the class `hide-on-keyboard-open`.
 *
 * ```html
 * <div class="hide-on-keyboard-open">
 *   <div id="google-map"></div>
 * </div>
 * ```
 * ----------
 *
 * ### Plugin Usage
 * Information on using the plugin can be found at
 * [https://github.com/driftyco/ionic-plugins-keyboard](https://github.com/driftyco/ionic-plugins-keyboard).
 *
 * ----------
 *
 * ### Android Notes
 * - If your app is running in fullscreen, i.e. you have
 *   `<preference name="Fullscreen" value="true" />` in your `config.xml` file
 *   you will need to set `ionic.Platform.isFullScreen = true` manually.
 *
 * - You can configure the behavior of the web view when the keyboard shows by setting
 *   [android:windowSoftInputMode](http://developer.android.com/reference/android/R.attr.html#windowSoftInputMode)
 *   to either `adjustPan`, `adjustResize` or `adjustNothing` in your app's
 *   activity in `AndroidManifest.xml`. `adjustResize` is the recommended setting
 *   for Ionic, but if for some reason you do use `adjustPan` you will need to
 *   set `ionic.Platform.isFullScreen = true`.
 *
 *   ```xml
 *   <activity android:windowSoftInputMode="adjustResize">
 *
 *   ```
 *
 * ### iOS Notes
 * - If the content of your app (including the header) is being pushed up and
 *   out of view on input focus, try setting `cordova.plugins.Keyboard.disableScroll(true)`.
 *   This does **not** disable scrolling in the Ionic scroll view, rather it
 *   disables the native overflow scrolling that happens automatically as a
 *   result of focusing on inputs below the keyboard.
 *
 */

var keyboardViewportHeight = getViewportHeight();
var keyboardIsOpen;
var keyboardActiveElement;
var keyboardFocusOutTimer;
var keyboardFocusInTimer;
var keyboardPollHeightTimer;
var keyboardLastShow = 0;

var KEYBOARD_OPEN_CSS = 'keyboard-open';
var SCROLL_CONTAINER_CSS = 'scroll';

ionic.keyboard = {
  isOpen: false,
  height: null,
  landscape: false,

  hide: function() {
    clearTimeout(keyboardFocusInTimer);
    clearTimeout(keyboardFocusOutTimer);
    clearTimeout(keyboardPollHeightTimer);

    ionic.keyboard.isOpen = false;

    ionic.trigger('resetScrollView', {
      target: keyboardActiveElement
    }, true);

    ionic.requestAnimationFrame(function(){
      document.body.classList.remove(KEYBOARD_OPEN_CSS);
    });

    // the keyboard is gone now, remove the touchmove that disables native scroll
    if (window.navigator.msPointerEnabled) {
      document.removeEventListener("MSPointerMove", keyboardPreventDefault);
    } else {
      document.removeEventListener('touchmove', keyboardPreventDefault);
    }
    document.removeEventListener('keydown', keyboardOnKeyDown);

    if( keyboardHasPlugin() ) {
      cordova.plugins.Keyboard.close();
    }
  },

  show: function() {
    if( keyboardHasPlugin() ) {
      cordova.plugins.Keyboard.show();
    }
  }
};

function keyboardInit() {
  if( keyboardHasPlugin() ) {
    window.addEventListener('native.keyboardshow', keyboardNativeShow);
    window.addEventListener('native.keyboardhide', keyboardFocusOut);

    //deprecated
    window.addEventListener('native.showkeyboard', keyboardNativeShow);
    window.addEventListener('native.hidekeyboard', keyboardFocusOut);

  } else {
    document.body.addEventListener('focusout', keyboardFocusOut);
  }

  document.body.addEventListener('ionic.focusin', keyboardBrowserFocusIn);
  document.body.addEventListener('focusin', keyboardBrowserFocusIn);

  document.body.addEventListener('orientationchange', keyboardOrientationChange);

  if (window.navigator.msPointerEnabled) {
    document.removeEventListener("MSPointerDown", keyboardInit);
  } else {
    document.removeEventListener('touchstart', keyboardInit);
  }
}

function keyboardNativeShow(e) {
  clearTimeout(keyboardFocusOutTimer);
  ionic.keyboard.height = e.keyboardHeight;
}

function keyboardBrowserFocusIn(e) {
  if( !e.target || e.target.readOnly || !ionic.tap.isTextInput(e.target) || ionic.tap.isDateInput(e.target) || !keyboardIsWithinScroll(e.target) ) return;

  document.addEventListener('keydown', keyboardOnKeyDown, false);

  document.body.scrollTop = 0;
  document.body.querySelector('.scroll-content').scrollTop = 0;

  keyboardActiveElement = e.target;

  keyboardSetShow(e);
}

function keyboardSetShow(e) {
  clearTimeout(keyboardFocusInTimer);
  clearTimeout(keyboardFocusOutTimer);

  keyboardFocusInTimer = setTimeout(function(){
    if ( keyboardLastShow + 350 > Date.now() ) return;
    console.log('keyboardSetShow');
    keyboardLastShow = Date.now();
    var keyboardHeight;
    var elementBounds = keyboardActiveElement.getBoundingClientRect();
    var count = 0;

    keyboardPollHeightTimer = setInterval(function(){

      keyboardHeight = keyboardGetHeight();
      if (count > 10){
        clearInterval(keyboardPollHeightTimer);
        //waited long enough, just guess
        keyboardHeight = 275;
      }
      if (keyboardHeight){
        clearInterval(keyboardPollHeightTimer);
        keyboardShow(e.target, elementBounds.top, elementBounds.bottom, keyboardViewportHeight, keyboardHeight);
      }
      count++;

    }, 100);
  }, 32);
}

function keyboardShow(element, elementTop, elementBottom, viewportHeight, keyboardHeight) {
  var details = {
    target: element,
    elementTop: Math.round(elementTop),
    elementBottom: Math.round(elementBottom),
    keyboardHeight: keyboardHeight,
    viewportHeight: viewportHeight
  };

  details.hasPlugin = keyboardHasPlugin();

  details.contentHeight = viewportHeight - keyboardHeight;

  console.log('keyboardShow', keyboardHeight, details.contentHeight);

  // figure out if the element is under the keyboard
  details.isElementUnderKeyboard = (details.elementBottom > details.contentHeight);

  ionic.keyboard.isOpen = true;

  // send event so the scroll view adjusts
  keyboardActiveElement = element;
  ionic.trigger('scrollChildIntoView', details, true);

  ionic.requestAnimationFrame(function(){
    document.body.classList.add(KEYBOARD_OPEN_CSS);
  });

  // any showing part of the document that isn't within the scroll the user
  // could touchmove and cause some ugly changes to the app, so disable
  // any touchmove events while the keyboard is open using e.preventDefault()
  if (window.navigator.msPointerEnabled) {
    document.addEventListener("MSPointerMove", keyboardPreventDefault, false);
  } else {
    document.addEventListener('touchmove', keyboardPreventDefault, false);
  }

  return details;
}

function keyboardFocusOut(e) {
  clearTimeout(keyboardFocusOutTimer);

  keyboardFocusOutTimer = setTimeout(ionic.keyboard.hide, 350);
}

function keyboardUpdateViewportHeight() {
  if( getViewportHeight() > keyboardViewportHeight ) {
    keyboardViewportHeight = getViewportHeight();
  }
}

function keyboardOnKeyDown(e) {
  if( ionic.scroll.isScrolling ) {
    keyboardPreventDefault(e);
  }
}

function keyboardPreventDefault(e) {
  if( e.target.tagName !== 'TEXTAREA' ) {
    e.preventDefault();
  }
}

function keyboardOrientationChange() {
  var updatedViewportHeight = getViewportHeight();

  //too slow, have to wait for updated height
  if (updatedViewportHeight === keyboardViewportHeight){
    var count = 0;
    var pollViewportHeight = setInterval(function(){
      //give up
      if (count > 10){
        clearInterval(pollViewportHeight);
      }

      updatedViewportHeight = getViewportHeight();

      if (updatedViewportHeight !== keyboardViewportHeight){
        if (updatedViewportHeight < keyboardViewportHeight){
          ionic.keyboard.landscape = true;
        } else {
          ionic.keyboard.landscape = false;
        }
        keyboardViewportHeight = updatedViewportHeight;
        clearInterval(pollViewportHeight);
      }
      count++;

    }, 50);
  } else {
    keyboardViewportHeight = updatedViewportHeight;
  }
}

function keyboardGetHeight() {
  // check if we are already have a keyboard height from the plugin
  if ( ionic.keyboard.height ) {
    return ionic.keyboard.height;
  }

  if ( ionic.Platform.isAndroid() ){
    //should be using the plugin, no way to know how big the keyboard is, so guess
    if ( ionic.Platform.isFullScreen ){
      return 275;
    }
    //otherwise, wait for the screen to resize
    if ( getViewportHeight() < keyboardViewportHeight ){
      return keyboardViewportHeight - getViewportHeight();
    } else {
      return 0;
    }
  }

  // fallback for when its the webview without the plugin
  // or for just the standard web browser
  if( ionic.Platform.isIOS() ) {
    if ( ionic.keyboard.landscape ){
      return 206;
    }

    if (!ionic.Platform.isWebView()){
      return 216;
    }

    return 260;
  }

  // safe guess
  return 275;
}

function getViewportHeight() {
  return window.innerHeight || screen.height;
}

function keyboardIsWithinScroll(ele) {
  while(ele) {
    if(ele.classList.contains(SCROLL_CONTAINER_CSS)) {
      return true;
    }
    ele = ele.parentElement;
  }
  return false;
}

function keyboardHasPlugin() {
  return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
}

ionic.Platform.ready(function() {
  keyboardUpdateViewportHeight();

  // Android sometimes reports bad innerHeight on window.load
  // try it again in a lil bit to play it safe
  setTimeout(keyboardUpdateViewportHeight, 999);

  // only initialize the adjustments for the virtual keyboard
  // if a touchstart event happens
  if (window.navigator.msPointerEnabled) {
    document.addEventListener("MSPointerDown", keyboardInit, false);
  } else {
    document.addEventListener('touchstart', keyboardInit, false);
  }
});

