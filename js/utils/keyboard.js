
/*
IONIC KEYBOARD
---------------

*/

var keyboardViewportHeight = window.innerHeight;
var keyboardIsOpen;
var keyboardActiveElement;
var keyboardFocusOutTimer;
var keyboardFocusInTimer;

var KEYBOARD_OPEN_CSS = 'keyboard-open';
var SCROLL_CONTAINER_CSS = 'scroll';

ionic.keyboard = {
  isOpen: false,
  height: null
};

function keyboardInit() {
  if( keyboardHasPlugin() ) {
    window.addEventListener('native.showkeyboard', keyboardNativeShow);
  }

  document.body.addEventListener('ionic.focusin', keyboardBrowserFocusIn);
  document.body.addEventListener('focusin', keyboardBrowserFocusIn);

  document.body.addEventListener('focusout', keyboardFocusOut);
  document.body.addEventListener('orientationchange', keyboardOrientationChange);

  document.removeEventListener('touchstart', keyboardInit);
}

function keyboardNativeShow(e) {
  ionic.keyboard.height = e.keyboardHeight;
}

function keyboardBrowserFocusIn(e) {
  if( !e.target || !ionic.tap.isTextInput(e.target) || !keyboardIsWithinScroll(e.target) ) return;

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
    var keyboardHeight = keyboardGetHeight();
    var elementBounds = keyboardActiveElement.getBoundingClientRect();
    
    setTimeout(function(){
      keyboardShow(e.target, elementBounds.top, elementBounds.bottom, keyboardViewportHeight, keyboardHeight);
    }, (ionic.Platform.isIOS() ? 0 : 350)); 
  }, 32);
}

function keyboardShow(element, elementTop, elementBottom, viewportHeight, keyboardHeight) {
  var details = {
    target: element,
    elementTop: Math.round(elementTop),
    elementBottom: Math.round(elementBottom),
    keyboardHeight: keyboardHeight
  };

  if( keyboardIsOverWebView() ) {
    // keyboard sits on top of the view, but doesn't adjust the view's height
    // lower the content height by subtracting the keyboard height from the view height
    details.contentHeight = viewportHeight - keyboardHeight;
  } else {
    // view's height was shrunk down and the keyboard takes up the space the view doesn't fill
    // do not add extra padding at the bottom of the scroll view, native already did that
    details.contentHeight = window.innerHeight;
  }

  console.debug('keyboardShow', keyboardHeight, details.contentHeight);

  // distance from top of input to the top of the keyboard
  details.keyboardTopOffset = details.elementTop - details.contentHeight;

  console.debug('keyboardTopOffset', details.elementTop, details.contentHeight, details.keyboardTopOffset);

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
  document.addEventListener('touchmove', keyboardPreventDefault, false);

  return details;
}

function keyboardFocusOut(e) {
  clearTimeout(keyboardFocusInTimer);
  clearTimeout(keyboardFocusOutTimer);

  keyboardFocusOutTimer = setTimeout(keyboardHide, 350);
}

function keyboardHide() {
  console.debug('keyboardHide');
  ionic.keyboard.isOpen = false;

  ionic.trigger('resetScrollView', {
    target: keyboardActiveElement
  }, true);

  ionic.requestAnimationFrame(function(){
    document.body.classList.remove(KEYBOARD_OPEN_CSS);
  });

  // the keyboard is gone now, remove the touchmove that disables native scroll
  document.removeEventListener('touchmove', keyboardPreventDefault);
  document.removeEventListener('keydown', keyboardOnKeyDown);
}

function keyboardUpdateViewportHeight() {
  if( window.innerHeight > keyboardViewportHeight ) {
    keyboardViewportHeight = window.innerHeight;
  }
}

function keyboardOnKeyDown(e) {
  if( ionic.scroll.isScrolling ) {
    keyboardPreventDefault(e);
  }
}

function keyboardPreventDefault(e) {
  e.preventDefault();
}

function keyboardOrientationChange() {
  keyboardViewportHeight = window.innerHeight;
  setTimeout(function(){
    keyboardViewportHeight = window.innerHeight;
  }, 999);
}

function keyboardGetHeight() {
  // check if we are already have a keyboard height from the plugin
  if (ionic.keyboard.height ) {
    return ionic.keyboard.height;
  }

  // fallback for when its the webview without the plugin
  // or for just the standard web browser
  if( ionic.Platform.isIOS() ) {
    if( ionic.Platform.isWebView() ) {
      return 260;
    }
    return 216;
  } else if( ionic.Platform.isAndroid() ) {
    //guess for now
    return 275;
  }

  // safe guess
  return 275;
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

function keyboardIsOverWebView() {
  if (ionic.Platform.isIOS()){
    if ( ionic.Platform.isWebView() ){
      //6.1 is over webview
      return (ionic.Platform.version() < 7.0); 
    }
    else {
      //safari is always over webview
      return true;
    }
  }

  if ( ionic.Platform.isAndroid() && ionic.Platform.isWebView() ){
    return ionic.Platform.isFullScreen;
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
  document.addEventListener('touchstart', keyboardInit, false);
});

