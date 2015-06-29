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
 *
 * Note: For performance reasons, elements will not be hidden for 400ms after the start of the `native.keyboardshow` event
 * from the Ionic Keyboard plugin. If you would like them to disappear immediately, you could do something
 * like:
 *
 * ```js
 *   window.addEventListener('native.keyboardshow', function(){
 *     document.body.classList.add('keyboard-open');
 *   });
 * ```
 * This adds the same `keyboard-open` class that is normally added by Ionic 400ms after the keyboard
 * opens. However, bear in mind that adding this class to the body immediately may cause jank in any
 * animations on Android that occur when the keyboard opens (for example, scrolling any obscured inputs into view).
 *
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

/**
 * The current viewport height.
 */
var keyboardCurrentViewportHeight = 0;

/**
 * The viewport height when in portrait orientation.
 */
var keyboardPortraitViewportHeight = 0;

/**
 * The viewport height when in landscape orientation.
 */
var keyboardLandscapeViewportHeight = 0;

/**
 * The currently focused input.
 */
var keyboardActiveElement;

/**
 * The previously focused input used to reset keyboard after focusing on a
 * new non-keyboard element
 */
var lastKeyboardActiveElement;

/**
 * The scroll view containing the currently focused input.
 */
var scrollView;

/**
 * Timer for the setInterval that polls window.innerHeight to determine whether
 * the layout has updated for the keyboard showing/hiding.
 */
var waitForResizeTimer;

/**
 * Sometimes when switching inputs or orientations, focusout will fire before
 * focusin, so this timer is for the small setTimeout to determine if we should
 * really focusout/hide the keyboard.
 */
var keyboardFocusOutTimer;

/**
 * on Android, orientationchange will fire before the keyboard plugin notifies
 * the browser that the keyboard will show/is showing, so this flag indicates
 * to nativeShow that there was an orientationChange and we should update
 * the viewport height with an accurate keyboard height value
 */
var wasOrientationChange = false;

/**
 * CSS class added to the body indicating the keyboard is open.
 */
var KEYBOARD_OPEN_CSS = 'keyboard-open';

/**
 * CSS class that indicates a scroll container.
 */
var SCROLL_CONTAINER_CSS = 'scroll-content';

/**
 * Debounced keyboardFocusIn function
 */
var debouncedKeyboardFocusIn = ionic.debounce(keyboardFocusIn, 200, true);

/**
 * Debounced keyboardNativeShow function
 */
var debouncedKeyboardNativeShow = ionic.debounce(keyboardNativeShow, 100, true);

/**
 * Ionic keyboard namespace.
 * @namespace keyboard
 */
ionic.keyboard = {

  /**
   * Whether the keyboard is open or not.
   */
  isOpen: false,

  /**
   * Whether the keyboard is closing or not.
   */
  isClosing: false,

  /**
   * Whether the keyboard is opening or not.
   */
  isOpening: false,

  /**
   * The height of the keyboard in pixels, as reported by the keyboard plugin.
   * If the plugin is not available, calculated as the difference in
   * window.innerHeight after the keyboard has shown.
   */
  height: 0,

  /**
   * Whether the device is in landscape orientation or not.
   */
  isLandscape: false,

  /**
   * Whether the keyboard event listeners have been added or not
   */
  isInitialized: false,

  /**
   * Hide the keyboard, if it is open.
   */
  hide: function() {
    if (keyboardHasPlugin()) {
      cordova.plugins.Keyboard.close();
    }
    keyboardActiveElement && keyboardActiveElement.blur();
  },

  /**
   * An alias for cordova.plugins.Keyboard.show(). If the keyboard plugin
   * is installed, show the keyboard.
   */
  show: function() {
    if (keyboardHasPlugin()) {
      cordova.plugins.Keyboard.show();
    }
  },

  /**
   * Remove all keyboard related event listeners, effectively disabling Ionic's
   * keyboard adjustments.
   */
  disable: function() {
    if (keyboardHasPlugin()) {
      window.removeEventListener('native.keyboardshow', debouncedKeyboardNativeShow );
      window.removeEventListener('native.keyboardhide', keyboardFocusOut);
    } else {
      document.body.removeEventListener('focusout', keyboardFocusOut);
    }

    document.body.removeEventListener('ionic.focusin', debouncedKeyboardFocusIn);
    document.body.removeEventListener('focusin', debouncedKeyboardFocusIn);

    window.removeEventListener('orientationchange', keyboardOrientationChange);

    if ( window.navigator.msPointerEnabled ) {
      document.removeEventListener("MSPointerDown", keyboardInit);
    } else {
      document.removeEventListener('touchstart', keyboardInit);
    }
    ionic.keyboard.isInitialized = false;
  },

  /**
   * Alias for keyboardInit, initialize all keyboard related event listeners.
   */
  enable: function() {
    keyboardInit();
  }
};

// Initialize the viewport height (after ionic.keyboard.height has been
// defined).
keyboardCurrentViewportHeight = getViewportHeight();


                             /* Event handlers */
/* ------------------------------------------------------------------------- */

/**
 * Event handler for first touch event, initializes all event listeners
 * for keyboard related events. Also aliased by ionic.keyboard.enable.
 */
function keyboardInit() {

  if (ionic.keyboard.isInitialized) return;

  if (keyboardHasPlugin()) {
    window.addEventListener('native.keyboardshow', debouncedKeyboardNativeShow);
    window.addEventListener('native.keyboardhide', keyboardFocusOut);
  } else {
    document.body.addEventListener('focusout', keyboardFocusOut);
  }

  document.body.addEventListener('ionic.focusin', debouncedKeyboardFocusIn);
  document.body.addEventListener('focusin', debouncedKeyboardFocusIn);

  if (window.navigator.msPointerEnabled) {
    document.removeEventListener("MSPointerDown", keyboardInit);
  } else {
    document.removeEventListener('touchstart', keyboardInit);
  }

  ionic.keyboard.isInitialized = true;
}

/**
 * Event handler for 'native.keyboardshow' event, sets keyboard.height to the
 * reported height and keyboard.isOpening to true. Then calls
 * keyboardWaitForResize with keyboardShow or keyboardUpdateViewportHeight as
 * the callback depending on whether the event was triggered by a focusin or
 * an orientationchange.
 */
function keyboardNativeShow(e) {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardNativeShow fired at: " + Date.now());
  //console.log("keyboardNativeshow window.innerHeight: " + window.innerHeight);

  if (!ionic.keyboard.isOpen || ionic.keyboard.isClosing) {
    ionic.keyboard.isOpening = true;
    ionic.keyboard.isClosing = false;
  }

  ionic.keyboard.height = e.keyboardHeight;
  //console.log('nativeshow keyboard height:' + e.keyboardHeight);

  if (wasOrientationChange) {
    keyboardWaitForResize(keyboardUpdateViewportHeight, true);
  } else {
    keyboardWaitForResize(keyboardShow, true);
  }
}

/**
 * Event handler for 'focusin' and 'ionic.focusin' events. Initializes
 * keyboard state (keyboardActiveElement and keyboard.isOpening) for the
 * appropriate adjustments once the window has resized.  If not using the
 * keyboard plugin, calls keyboardWaitForResize with keyboardShow as the
 * callback or keyboardShow right away if the keyboard is already open.  If
 * using the keyboard plugin does nothing and lets keyboardNativeShow handle
 * adjustments with a more accurate keyboard height.
 */
function keyboardFocusIn(e) {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardFocusIn from: " + e.type + " at: " + Date.now());

  if (!e.target ||
      e.target.readOnly ||
      !ionic.tap.isKeyboardElement(e.target) ||
      !(scrollView = ionic.DomUtil.getParentWithClass(e.target, SCROLL_CONTAINER_CSS))) {
    if (keyboardActiveElement) {
        lastKeyboardActiveElement = keyboardActiveElement;
    }
    keyboardActiveElement = null;
    return;
  }

  keyboardActiveElement = e.target;

  // if using JS scrolling, undo the effects of native overflow scroll so the
  // scroll view is positioned correctly
  if (!scrollView.classList.contains("overflow-scroll")) {
    document.body.scrollTop = 0;
    scrollView.scrollTop = 0;
    ionic.requestAnimationFrame(function(){
      document.body.scrollTop = 0;
      scrollView.scrollTop = 0;
    });

    // any showing part of the document that isn't within the scroll the user
    // could touchmove and cause some ugly changes to the app, so disable
    // any touchmove events while the keyboard is open using e.preventDefault()
    if (window.navigator.msPointerEnabled) {
      document.addEventListener("MSPointerMove", keyboardPreventDefault, false);
    } else {
      document.addEventListener('touchmove', keyboardPreventDefault, false);
    }
  }

  if (!ionic.keyboard.isOpen || ionic.keyboard.isClosing) {
    ionic.keyboard.isOpening = true;
    ionic.keyboard.isClosing = false;
  }

  // attempt to prevent browser from natively scrolling input into view while
  // we are trying to do the same (while we are scrolling) if the user taps the
  // keyboard
  document.addEventListener('keydown', keyboardOnKeyDown, false);



  // if we aren't using the plugin and the keyboard isn't open yet, wait for the
  // window to resize so we can get an accurate estimate of the keyboard size,
  // otherwise we do nothing and let nativeShow call keyboardShow once we have
  // an exact keyboard height
  // if the keyboard is already open, go ahead and scroll the input into view
  // if necessary
  if (!ionic.keyboard.isOpen && !keyboardHasPlugin()) {
    keyboardWaitForResize(keyboardShow, true);

  } else if (ionic.keyboard.isOpen) {
    keyboardShow();
  }
}

/**
 * Event handler for 'focusout' events. Sets keyboard.isClosing to true and
 * calls keyboardWaitForResize with keyboardHide as the callback after a small
 * timeout.
 */
function keyboardFocusOut() {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardFocusOut fired at: " + Date.now());
  //console.log("keyboardFocusOut event type: " + e.type);

  if (ionic.keyboard.isOpen || ionic.keyboard.isOpening) {
    ionic.keyboard.isClosing = true;
    ionic.keyboard.isOpening = false;
  }

  // Call keyboardHide with a slight delay because sometimes on focus or
  // orientation change focusin is called immediately after, so we give it time
  // to cancel keyboardHide
  keyboardFocusOutTimer = setTimeout(function() {
    ionic.requestAnimationFrame(function() {
      // focusOut during or right after an orientationchange, so we didn't get
      // a chance to update the viewport height yet, do it and keyboardHide
      //console.log("focusOut, wasOrientationChange: " + wasOrientationChange);
      if (wasOrientationChange) {
        keyboardWaitForResize(function(){
          keyboardUpdateViewportHeight();
          keyboardHide();
        }, false);
      } else {
        keyboardWaitForResize(keyboardHide, false);
      }
    });
  }, 50);
}

/**
 * Event handler for 'orientationchange' events. If using the keyboard plugin
 * and the keyboard is open on Android, sets wasOrientationChange to true so
 * nativeShow can update the viewport height with an accurate keyboard height.
 * If the keyboard isn't open or keyboard plugin isn't being used,
 * waits for the window to resize before updating the viewport height.
 *
 * On iOS, where orientationchange fires after the keyboard has already shown,
 * updates the viewport immediately, regardless of if the keyboard is already
 * open.
 */
function keyboardOrientationChange() {
  //console.log("orientationchange fired at: " + Date.now());
  //console.log("orientation was: " + (ionic.keyboard.isLandscape ? "landscape" : "portrait"));

  // toggle orientation
  ionic.keyboard.isLandscape = !ionic.keyboard.isLandscape;
  // //console.log("now orientation is: " + (ionic.keyboard.isLandscape ? "landscape" : "portrait"));

  // no need to wait for resizing on iOS, and orientationchange always fires
  // after the keyboard has opened, so it doesn't matter if it's open or not
  if (ionic.Platform.isIOS()) {
    keyboardUpdateViewportHeight();
  }

  // On Android, if the keyboard isn't open or we aren't using the keyboard
  // plugin, update the viewport height once everything has resized. If the
  // keyboard is open and we are using the keyboard plugin do nothing and let
  // nativeShow handle it using an accurate keyboard height.
  if ( ionic.Platform.isAndroid()) {
    if (!ionic.keyboard.isOpen || !keyboardHasPlugin()) {
      keyboardWaitForResize(keyboardUpdateViewportHeight, false);
    } else {
      wasOrientationChange = true;
    }
  }
}

/**
 * Event handler for 'keydown' event. Tries to prevent browser from natively
 * scrolling an input into view when a user taps the keyboard while we are
 * scrolling the input into view ourselves with JS.
 */
function keyboardOnKeyDown(e) {
  if (ionic.scroll.isScrolling) {
    keyboardPreventDefault(e);
  }
}

/**
 * Event for 'touchmove' or 'MSPointerMove'. Prevents native scrolling on
 * elements outside the scroll view while the keyboard is open.
 */
function keyboardPreventDefault(e) {
  if (e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
}

                              /* Private API */
/* -------------------------------------------------------------------------- */

/**
 * Polls window.innerHeight until it has updated to an expected value (or
 * sufficient time has passed) before calling the specified callback function.
 * Only necessary for non-fullscreen Android which sometimes reports multiple
 * window.innerHeight values during interim layouts while it is resizing.
 *
 * On iOS, the window.innerHeight will already be updated, but we use the 50ms
 * delay as essentially a timeout so that scroll view adjustments happen after
 * the keyboard has shown so there isn't a white flash from us resizing too
 * quickly.
 *
 * @param {Function} callback the function to call once the window has resized
 * @param {boolean} isOpening whether the resize is from the keyboard opening
 * or not
 */
function keyboardWaitForResize(callback, isOpening) {
  clearInterval(waitForResizeTimer);
  var count = 0;
  var maxCount;
  var initialHeight = getViewportHeight();
  var viewportHeight = initialHeight;

  //console.log("waitForResize initial viewport height: " + viewportHeight);
  //var start = Date.now();
  //console.log("start: " + start);

  // want to fail relatively quickly on modern android devices, since it's much
  // more likely we just have a bad keyboard height
  if (ionic.Platform.isAndroid() && ionic.Platform.version() < 4.4) {
    maxCount = 30;
  } else if (ionic.Platform.isAndroid()) {
    maxCount = 10;
  } else {
    maxCount = 1;
  }

  // poll timer
  waitForResizeTimer = setInterval(function(){
    viewportHeight = getViewportHeight();

    // height hasn't updated yet, try again in 50ms
    // if not using plugin, wait for maxCount to ensure we have waited long enough
    // to get an accurate keyboard height
    if (++count < maxCount &&
        ((!isPortraitViewportHeight(viewportHeight) &&
         !isLandscapeViewportHeight(viewportHeight)) ||
         !ionic.keyboard.height)) {
      return;
    }

    // infer the keyboard height from the resize if not using the keyboard plugin
    if (!keyboardHasPlugin()) {
      ionic.keyboard.height = Math.abs(initialHeight - window.innerHeight);
    }

    // set to true if we were waiting for the keyboard to open
    ionic.keyboard.isOpen = isOpening;

    clearInterval(waitForResizeTimer);
    //var end = Date.now();
    //console.log("waitForResize count: " + count);
    //console.log("end: " + end);
    //console.log("difference: " + ( end - start ) + "ms");

    //console.log("callback: " + callback.name);
    callback();

  }, 50);

  return maxCount; //for tests
}

/**
 * On keyboard close sets keyboard state to closed, resets the scroll view,
 * removes CSS from body indicating keyboard was open, removes any event
 * listeners for when the keyboard is open and on Android blurs the active
 * element (which in some cases will still have focus even if the keyboard
 * is closed and can cause it to reappear on subsequent taps).
 */
function keyboardHide() {
  clearTimeout(keyboardFocusOutTimer);
  //console.log("keyboardHide");

  ionic.keyboard.isOpen = false;
  ionic.keyboard.isClosing = false;

  if (keyboardActiveElement || lastKeyboardActiveElement) {
    ionic.trigger('resetScrollView', {
      target: keyboardActiveElement || lastKeyboardActiveElement
    }, true);
  }

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

  if (ionic.Platform.isAndroid()) {
    // on android closing the keyboard with the back/dismiss button won't remove
    // focus and keyboard can re-appear on subsequent taps (like scrolling)
    if (keyboardHasPlugin()) cordova.plugins.Keyboard.close();
    keyboardActiveElement && keyboardActiveElement.blur();
  }

  keyboardActiveElement = null;
  lastKeyboardActiveElement = null;
}

/**
 * On keyboard open sets keyboard state to open, adds CSS to the body
 * indicating the keyboard is open and tells the scroll view to resize and
 * the currently focused input into view if necessary.
 */
function keyboardShow() {

  ionic.keyboard.isOpen = true;
  ionic.keyboard.isOpening = false;

  var details = {
    keyboardHeight: keyboardGetHeight(),
    viewportHeight: keyboardCurrentViewportHeight
  };

  if (keyboardActiveElement) {
    details.target = keyboardActiveElement;

    var elementBounds = keyboardActiveElement.getBoundingClientRect();

    details.elementTop = Math.round(elementBounds.top);
    details.elementBottom = Math.round(elementBounds.bottom);

    details.windowHeight = details.viewportHeight - details.keyboardHeight;
    //console.log("keyboardShow viewportHeight: " + details.viewportHeight +
    //", windowHeight: " + details.windowHeight +
    //", keyboardHeight: " + details.keyboardHeight);

    // figure out if the element is under the keyboard
    details.isElementUnderKeyboard = (details.elementBottom > details.windowHeight);
    //console.log("isUnderKeyboard: " + details.isElementUnderKeyboard);
    //console.log("elementBottom: " + details.elementBottom);

    // send event so the scroll view adjusts
    ionic.trigger('scrollChildIntoView', details, true);
  }

  setTimeout(function(){
    document.body.classList.add(KEYBOARD_OPEN_CSS);
  }, 400);

  return details; //for testing
}

/* eslint no-unused-vars:0 */
function keyboardGetHeight() {
  // check if we already have a keyboard height from the plugin or resize calculations
  if (ionic.keyboard.height) {
    return ionic.keyboard.height;
  }

  if (ionic.Platform.isAndroid()) {
    // should be using the plugin, no way to know how big the keyboard is, so guess
    if ( ionic.Platform.isFullScreen ) {
      return 275;
    }
    // otherwise just calculate it
    var contentHeight = window.innerHeight;
    if (contentHeight < keyboardCurrentViewportHeight) {
      return keyboardCurrentViewportHeight - contentHeight;
    } else {
      return 0;
    }
  }

  // fallback for when it's the webview without the plugin
  // or for just the standard web browser
  // TODO: have these be based on device
  if (ionic.Platform.isIOS()) {
    if (ionic.keyboard.isLandscape) {
      return 206;
    }

    if (!ionic.Platform.isWebView()) {
      return 216;
    }

    return 260;
  }

  // safe guess
  return 275;
}

function isPortraitViewportHeight(viewportHeight) {
  return !!(!ionic.keyboard.isLandscape &&
         keyboardPortraitViewportHeight &&
         (Math.abs(keyboardPortraitViewportHeight - viewportHeight) < 2));
}

function isLandscapeViewportHeight(viewportHeight) {
  return !!(ionic.keyboard.isLandscape &&
         keyboardLandscapeViewportHeight &&
         (Math.abs(keyboardLandscapeViewportHeight - viewportHeight) < 2));
}

function keyboardUpdateViewportHeight() {
  wasOrientationChange = false;
  keyboardCurrentViewportHeight = getViewportHeight();

  if (ionic.keyboard.isLandscape && !keyboardLandscapeViewportHeight) {
    //console.log("saved landscape: " + keyboardCurrentViewportHeight);
    keyboardLandscapeViewportHeight = keyboardCurrentViewportHeight;

  } else if (!ionic.keyboard.isLandscape && !keyboardPortraitViewportHeight) {
    //console.log("saved portrait: " + keyboardCurrentViewportHeight);
    keyboardPortraitViewportHeight = keyboardCurrentViewportHeight;
  }

  if (keyboardActiveElement) {
    ionic.trigger('resetScrollView', {
      target: keyboardActiveElement
    }, true);
  }

  if (ionic.keyboard.isOpen && ionic.tap.isTextInput(keyboardActiveElement)) {
    keyboardShow();
  }
}

function keyboardInitViewportHeight() {
  var viewportHeight = getViewportHeight();
  //console.log("Keyboard init VP: " + viewportHeight + " " + window.innerWidth);
  // can't just use window.innerHeight in case the keyboard is opened immediately
  if ((viewportHeight / window.innerWidth) < 1) {
    ionic.keyboard.isLandscape = true;
  }
  //console.log("ionic.keyboard.isLandscape is: " + ionic.keyboard.isLandscape);

  // initialize or update the current viewport height values
  keyboardCurrentViewportHeight = viewportHeight;
  if (ionic.keyboard.isLandscape && !keyboardLandscapeViewportHeight) {
    keyboardLandscapeViewportHeight = keyboardCurrentViewportHeight;
  } else if (!ionic.keyboard.isLandscape && !keyboardPortraitViewportHeight) {
    keyboardPortraitViewportHeight = keyboardCurrentViewportHeight;
  }
}

function getViewportHeight() {
  var windowHeight = window.innerHeight;
  //console.log('window.innerHeight is: ' + windowHeight);
  //console.log('kb height is: ' + ionic.keyboard.height);
  //console.log('kb isOpen: ' + ionic.keyboard.isOpen);

  //TODO: add iPad undocked/split kb once kb plugin supports it
  // the keyboard overlays the window on Android fullscreen
  if (!(ionic.Platform.isAndroid() && ionic.Platform.isFullScreen) &&
      (ionic.keyboard.isOpen || ionic.keyboard.isOpening) &&
      !ionic.keyboard.isClosing) {

     return windowHeight + keyboardGetHeight();
  }
  return windowHeight;
}

function keyboardHasPlugin() {
  return !!(window.cordova && cordova.plugins && cordova.plugins.Keyboard);
}

ionic.Platform.ready(function() {
  keyboardInitViewportHeight();

  window.addEventListener('orientationchange', keyboardOrientationChange);

  // if orientation changes while app is in background, update on resuming
  /*
  if ( ionic.Platform.isWebView() ) {
    document.addEventListener('resume', keyboardInitViewportHeight);

    if (ionic.Platform.isAndroid()) {
      //TODO: onbackpressed to detect keyboard close without focusout or plugin
    }
  }
  */

  // if orientation changes while app is in background, update on resuming
/*  if ( ionic.Platform.isWebView() ) {
    document.addEventListener('pause', function() {
      window.removeEventListener('orientationchange', keyboardOrientationChange);
    })
    document.addEventListener('resume', function() {
      keyboardInitViewportHeight();
      window.addEventListener('orientationchange', keyboardOrientationChange)
    });
  }*/

  // Android sometimes reports bad innerHeight on window.load
  // try it again in a lil bit to play it safe
  setTimeout(keyboardInitViewportHeight, 999);

  // only initialize the adjustments for the virtual keyboard
  // if a touchstart event happens
  if (window.navigator.msPointerEnabled) {
    document.addEventListener("MSPointerDown", keyboardInit, false);
  } else {
    document.addEventListener('touchstart', keyboardInit, false);
  }
});

