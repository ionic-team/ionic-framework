
/*

Physical Device Testing Scenarios
---------------------------------
- Keyboard should show up when tapping on a text input
- Keyboard should show up when tapping on a label which surrounds a text input
- Keyboard should stay up if focused text input is tapped again
- Keyboard should go away when text input is focused, then tapped outside of input
- Keyboard should hide when tapping the virtual keyboard's "Done" or down arrow, but tapping
- Should be able to move an inputs text caret when its focused
- Should be able to move an inputs text caret when its focused, and is wrapped with a label
  the input again will bring up the keyboard again
- Options dialog should show when tapping on a select
- Options dialog should show when tapping on a label which surrounds a select (not working in Android 2.3)
- Tapping a button element should fire one click
- Tapping an anchor element should fire one click
- Tapping a checkbox should fire one click
- Tapping a label which surrounds a checkbox should fire one click
- Tapping a radio button should fire one click
- Tapping a label which surrounds a radio button should fire one click
- Moving an input[range] slider should work
- Moving an input[range] slider when its in menu content of a should work
- Tapping the track on an input[range] slider should move the knob to that location (not a default in iOS)
- Tapping an input[file] should bring up the file dialog
- After tapping an input[file] and closing the input file dialog, tap a different
  element and the file dialog should NOT show up
- Element which is disabled should not be clicked
- Holding a touchstart, and not moving, should fire the click no matter how long the hold
- Holding a mousedown, and not moving, should fire the click no matter how long the hold
- Holding touchstart, then moving a few pixels cancels the click
- Holding mousedown, then moving a few pixels cancels the click
- Touchstart should set and remove the activated css class
- Mousedown should set and remove the activated css class
- Holding touchstart, then moving a few pixels removes the activated css class
- Holding mousedown, then moving a few pixels removes the activated css class
- An element or one of its parents with data-tap-disabled attribute should still click, but w/ a delay
- ALL THE ABOVE, BUT NOW WITH NG-CLICK ON THE INPUT!
- Tapping a div with an click event added should fire one click
- Tapping an img with an click event added should fire one click
- Can scroll when target is a text input, but it does not have focus
- Can scroll when the target is a text input and it already has focus
- Can hold a text input and move its text caret/cursor
- Can scroll when the target is a label
- Does not change focus 300ms after when tapping an input and the keyboard shows up
- The blinking cursor says in the input 300ms after the tap
- Can hit the keyboard's "next" button to change focus to the next input
- When flicking down a page, and a target was an input, it shouldn't focus and jank scrolling
- Do not show text caret of a focused input while scrolling, no matter what the target is
- After scrolling has come to a halt, previously focused input should be focused again
- Keyboard should stay up while scrolling if an input was focused
- Keyboard should not go away after scrolling stops and it focuses back on the previous focused input
- Should not create clones for tap inputs to hide cursor, like for checkboxes, radio, range, select
- Focus on an input, flick up, let go, and during animation flick down, and clone should go away
- While inputs are actively scrolling you should not be able to change focus
- If you touchstart on a text input, then scrolland touchend, it should not bring up the keyboard
- If you touchstart on a label wrapping a text input, then scroll and touchend, it should not bring up the keyboard
- When focused in a text input, be able to get out when tapping a checkbox
- Can scroll when the target is a select element (touch events only)
- Can scroll when the target is a label which wraps select element
- Can open the select options on touch when not scrolling
- Can open the select options mouse click when target is a select
- Can open the select options when target is a label wrapping a select

Tested on:
----------------------------
- iOS 6.1 iPad 3
- iOS 7.0 iPhone 4
- iOS 7.0 iPhone 5
- iOS 7.1 iPhone 5
- iOS 7.1 Simulator
- Android 2.3 HTC Incredible
- Android 2.3 Samsung Galaxy S
- Android 4.0 HTC Incredible
- Android 4.2 Nexus 4
- Android 4.3 Samsung S3
- Android 4.4 Motorola Moto G
- Android 4.4 Nexus 5
- OSX Chrome
- OSX Chrome (emulated touch screen)
- OSX Firefox

*/

window.console.log = function(){};

describe('Ionic Tap', function() {
  var deregisterTap;

  beforeEach(function() {
    window._setTimeout = window.setTimeout;
    window.setTimeout = function(){};
    _activeElement = null; // the element which has focus

    deregisterTap = ionic.tap.register(document.createElement('div'));
    ionic.scroll = { isScrolling: false };
    ionic.Platform.setPlatform(null);
    ionic.Platform._checkPlatforms();
  });

  afterEach(function(){
    window.setTimeout = window._setTimeout;
    deregisterTap();
  });

  it('Should trigger a labels child inputs click, and should not stop the labels end event so Android allows text editing', function() {
    var e = {
      type: 'touchstart',
      target: {
        tagName: 'LABEL',
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; },
        control: {
          tagName: 'INPUT',
          dispatchEvent: function() { e.target.control.dispatchedEvent = true; },
          focus: function() { e.target.control.focused = true; }
        }
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    tapClick(e);

    expect( e.target.dispatchedEvent ).toBeUndefined();
    expect( e.target.focused ).toBeUndefined();

    expect( e.target.control.dispatchedEvent ).toBeDefined();
    expect( e.target.control.focused ).toBeDefined();

    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should trigger a click for an element w/out a wrapping label', function() {
    var e = {
      type: 'touchstart',
      target: {
        tagName: 'INPUT',
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; }
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    tapClick(e);

    expect( e.target.dispatchedEvent ).toBeDefined();
    expect( e.target.focused ).toBeDefined();

    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();

  });

  it('Should not trigger a click if tapPointerMoved has moved', function() {
    var e = {
      type: 'touchstart',
      target: {
        tagName: 'INPUT',
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; }
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    tapPointerMoved = true;
    expect( tapClick(e) ).toEqual(false);

  });

  it('Should trigger click on mouseup and when nearby mousedown happened', function() {
    var e = {
      type: 'mousedown',
      clientX: 100, clientY: 100,
      target: {
        tagName: 'INPUT',
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; },
        classList: { contains: function(){} }
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    expect( e.target.dispatchedEvent ).toBeUndefined();

    tapMouseDown({clientX: 101, clientY: 101});
    tapMouseUp(e);

    expect( e.target.dispatchedEvent ).toBeDefined();
  });

  it('Should not trigger click on mouseup because mousedown coordinates too far away', function() {
    var e = {
      clientX: 100, clientY: 100,
      target: {
        tagName: 'INPUT',
        nodeType: 1,
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; },
        classList: { contains: function(){} }
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    expect( e.target.dispatchedEvent ).toBeUndefined();

    tapMouseDown({clientX: 201, clientY: 101});
    tapMouseUp(e);

    expect( e.target.dispatchedEvent ).toBeUndefined();
  });

  it('Should set tapHasPointerMoved=false on tapTouchStart', function() {
    tapPointerMoved = null;
    tapTouchStart({ preventDefault:function(){} });
    expect( tapPointerMoved ).toEqual(false);
  });

  it('Should not preventDefault on text input that already has focus and is iOS', function() {
    // prevent the default so iOS doesn't auto scroll to the input
    ionic.Platform.setPlatform('ios');
    var label = document.createElement('label');
    var textarea = document.createElement('textarea');
    label.appendChild(textarea);
    var e = {
      target: label,
      preventDefault: function() { e.preventedDefault = true; }
    };

    tapActiveEle = textarea;

    tapTouchStart(e);
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should preventDefault on text input that does not have focus and is iOS', function() {
    // prevent the default so iOS doesn't auto scroll to the input
    ionic.Platform.setPlatform('ios');
    var label = document.createElement('label');
    var textarea = document.createElement('textarea');
    label.appendChild(textarea);
    var e = {
      target: label,
      preventDefault: function() { e.preventedDefault = true; }
    };

    tapTouchStart(e);
    expect( e.preventedDefault ).toEqual(true);
  });

  it('Should not preventDefault on text input target thats not iOS', function() {
    // do not prevent default on touchend of a text input or else you cannot move the text caret
    ionic.Platform.setPlatform('android');
    var label = document.createElement('label');
    var textarea = document.createElement('textarea');
    label.appendChild(textarea);
    var e = {
      target: label,
      preventDefault: function() { e.preventedDefault = true; }
    };
    tapTouchStart(e);
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should set tapPointerMoved=false on tapTouchCancel', function() {
    tapPointerMoved = true;
    tapTouchCancel();
    expect( tapPointerMoved ).toEqual(false);
  });

  it('Should set tapHasPointerMoved=true on tapTouchMove', function() {
    tapPointerMoved = null;
    tapTouchStart({ clientX: 100, clientY: 100, preventDefault:function(){} });
    expect( tapPointerMoved ).toEqual(false);
    tapTouchMove({ clientX: 200, clientY: 100, target: document.createElement('button') });
    expect( tapPointerMoved ).toEqual(true);
  });

  it('Should set tapHasPointerMoved=false on tapMouseDown', function() {
    tapPointerMoved = null;
    tapMouseDown({});
    expect( tapPointerMoved ).toEqual(false);
  });

  it('Should set tapPointerMoved=false on tapMouseUp', function() {
    tapPointerMoved = true;
    tapMouseUp({ target: {} });
    expect( tapPointerMoved ).toEqual(false);
  });

  it('Should set tapHasPointerMoved=true on tapMouseMove', function() {
    tapPointerMoved = null;
    tapMouseDown({ clientX: 100, clientY: 100 });
    expect( tapPointerMoved ).toEqual(false);
    tapMouseMove({ clientX: 200, clientY: 100, target: document.createElement('button') });
    expect( tapPointerMoved ).toEqual(true);
  });

  it('Should stop event on mouseup if touch is enabled', function() {
    tapEnabledTouchEvents = true;
    var e = {
      stopPropagation: function() { this.stoppedPropagation = true; },
      preventDefault: function() { this.preventedDefault = true; }
    };
    tapMouseUp(e);
    expect( e.stoppedPropagation ).toEqual(true);
    expect( e.preventedDefault ).toEqual(true);
  });

  it('Should not stop event on mouseup if the target was a select element', function() {
    tapEnabledTouchEvents = false;
    e = {
      target: document.createElement('select'),
      stopPropagation: function() { this.stoppedPropagation = true; },
      preventDefault: function() { this.preventedDefault = true; }
    };
    expect( tapMouseUp(e) ).toBeFalsy();
    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should not stop event on mouseup if the target was an option element', function() {
    tapEnabledTouchEvents = false;
    e = {
      target: document.createElement('option'),
      stopPropagation: function() { this.stoppedPropagation = true; },
      preventDefault: function() { this.preventedDefault = true; }
    };
    expect( tapMouseUp(e) ).toEqual(false);
    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should stop event on mouseup if the target was an ion-option-button element', function() {
    tapEnabledTouchEvents = false;
    e = {
      target: document.createElement('ion-option-button'),
      stopPropagation: function() { this.stoppedPropagation = true; },
      preventDefault: function() { this.preventedDefault = true; }
    };
    expect( tapMouseUp(e) ).toBeUndefined();
    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should not stop event on mouseup if touch is not enabled', function() {
    tapEnabledTouchEvents = false;
    e = {
      target: document.createElement('button'),
      stopPropagation: function() { this.stoppedPropagation = true; },
      preventDefault: function() { this.preventedDefault = true; }
    };
    tapMouseUp(e);
    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should trigger click on touchend and nearby touchstart happened', function() {
    var e = {
      type: 'touchend',
      clientX: 101, clientY: 101,
      target: {
        tagName: 'INPUT',
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; },
        classList: { contains:function(){}}
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    tapTouchStart({clientX: 100, clientY: 100, preventDefault:function(){}});
    tapTouchEnd(e);

    expect( e.target.dispatchedEvent ).toBeDefined();
  });

  it('Should not trigger click on touchend because touchstart coordinates too far away', function() {
    var e = {
      type: 'touchstart',
      clientX: 100, clientY: 100,
      target: {
        tagName: 'INPUT',
        nodeType: 1,
        dispatchEvent: function() { e.target.dispatchedEvent = true; },
        focus: function() { e.target.focused = true; },
        classList: { contains:function(){}}
      },
      stopPropagation: function() { e.stoppedPropagation = true; },
      preventDefault: function() { e.preventedDefault = true; }
    };

    expect( e.target.dispatchedEvent ).toBeUndefined();

    tapTouchStart({clientX: 200, clientY: 100, preventDefault:function(){}});

    tapTouchEnd(e);

    expect( e.target.dispatchedEvent ).toBeUndefined();
  });

  it('Should tapEnabledTouchEvents because of touchstart', function() {
    tapEnabledTouchEvents = false;
    tapTouchStart({preventDefault:function(){}});
    tapEnabledTouchEvents = true;
  });

  it('Should cancel click on touchcancel', function() {
    tapTouchCancel();
    expect(tapPointerMoved).toEqual(false);
  });

  it('Should cancel click when touchmove coordinates goes too far from touchstart coordinates', function() {
    var e = { clientX: 100, clientY: 100, preventDefault:function(){} };
    tapTouchStart(e);

    expect( tapTouchMove({ clientX: 102, clientY: 100, target: document.createElement('button') }) ).toBeUndefined();

    expect( tapTouchMove({ clientX: 105, clientY: 100, target: document.createElement('button') }) ).toBeUndefined();

    expect( tapTouchMove({ clientX: 200, clientY: 100, target: document.createElement('button') }) ).toEqual(false);
  });

  it('Should cancel click when touchend coordinates are too far from touchstart coordinates', function() {
    var e = {
      clientX: 100, clientY: 100,
      dispatchEvent: function(){ this.dispatchedEvent = true; },
      preventDefault:function(){},
      classList: { contains:function(){}}
    };
    tapTouchStart(e);
    tapTouchEnd({ clientX: 200, clientY: 100, target: document.createElement('button') });
    expect( e.dispatchedEvent ).toBeUndefined();
  });

  it('Should preventDefault on touchend when the target is a select', function() {
    var e = {
      target: document.createElement('select'),
      clientX: 100, clientY: 100,
      dispatchEvent: function(){ this.dispatchedEvent = true; },
      preventDefault:function(){ this.preventedDefault = true; }
    };
    tapTouchEnd(e);
    expect( e.preventedDefault ).toEqual(true);

    e = {
      target: document.createElement('div'),
      clientX: 100, clientY: 100,
      dispatchEvent: function(){ this.dispatchedEvent = true; },
      preventDefault:function(){ this.preventedDefault = true; }
    };
    tapTouchEnd(e);
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should cancel click when mousemove coordinates goes too far from mousedown coordinates', function() {
    var e = { clientX: 100, clientY: 100 };
    tapMouseDown(e);

    expect( tapMouseMove({ clientX: 102, clientY: 100, target: document.createElement('button') }) ).toBeUndefined();

    expect( tapMouseMove({ clientX: 105, clientY: 100, target: document.createElement('button') }) ).toBeUndefined();

    expect( tapMouseMove({ clientX: 200, clientY: 100, target: document.createElement('button') }) ).toEqual(false);
  });

  it('Should cancel click when mouseup coordinates are too far from mousedown coordinates', function() {
    var e1 = {
      target: document.createElement('button'),
      clientX: 100, clientY: 100,
      dispatchEvent: function(){ this.dispatchedEvent = true; }
    };
    tapMouseDown(e1);

    var e2 = {
      target: document.createElement('button'),
      clientX: 100, clientY: 100,
      dispatchEvent: function(){ this.dispatchedEvent = true; }
    };
    tapMouseUp(e2);
    expect( e2.dispatchedEvent ).toBeUndefined();
  });

  it('Should do nothing if mousedown is a custom event from ionic tap', function() {
    var e = {
      isTapHandled: false,
      isIonicTap: true
    };
    tapMouseDown(e);
    expect( e.isTapHandled ).toEqual(false);
  });

  it('Should preventDefault on mousedown if touchend target is different than mousedown target', function() {
    tapLastTouchTarget = null;

    var touchEndEvent = {
      target: document.createElement('button'),
      clientX: 100, clientY: 100,
      preventDefault: function(){ this.defaultedPrevented = true; }
    };
    tapTouchEnd(touchEndEvent);
    expect( tapLastTouchTarget ).toEqual(touchEndEvent.target);

    var mouseDownEvent = {
      target: document.createElement('textarea'),
      clientX: 100, clientY: 100,
      preventDefault: function(){ this.defaultedPrevented = true; },
      stopPropagation: function(){ this.stoppedPropagation = true; }
    };
    tapMouseDown(mouseDownEvent);
    expect( mouseDownEvent.defaultedPrevented ).toEqual(true);
  });

  it('Should not preventDefault on mousedown if the target is a select element', function() {
    tapEnabledTouchEvents = true;
    var e = {
      isTapHandled: false,
      isIonicTap: false,
      target: document.createElement('select'),
      preventDefault: function(){ this.defaultedPrevented = true; },
      stopPropagation: function(){ this.stoppedPropagation = true; }
    };
    tapMouseDown(e);
    expect( e.stoppedPropagation ).toEqual(true);
    expect( e.defaultedPrevented ).toBeUndefined();

    e = {
      isTapHandled: false,
      isIonicTap: false,
      target: document.createElement('option'),
      preventDefault: function(){ this.defaultedPrevented = true; },
      stopPropagation: function(){ this.stoppedPropagation = true; }
    };
    tapMouseDown(e);
    expect( e.stoppedPropagation ).toEqual(true);
    expect( e.defaultedPrevented ).toBeUndefined();
  });

  it('Should tapClick with touchend and fire immediately', function() {
    var e = {
      target: {
        tagName: 'button',
        dispatchEvent: function(){
          this.dispatchedEvent = true;
        }
      }
    };
    tapClick(e);
    expect(e.target.dispatchedEvent).toEqual(true);
  });

  it('Should tapHasPointerMoved false if are null', function() {
    expect( tapHasPointerMoved(null) ).toEqual(false);
  });

  it('Should tapPointerStart false if are null', function() {
    tapPointerStart = null;
    expect( tapHasPointerMoved(null) ).toEqual(false);
  });

  it('Should tapPointerStart false if are null', function() {
    var e = {
      target: document.createElement('input')
    };
    tapPointerStart = {x:0, y:0};
    expect( tapHasPointerMoved(e) ).toEqual(false);
  });

  it('Should tapHasPointerMoved true if greater than or equal to release tolerance', function() {
    tapPointerStart = { x: 100, y: 100 };

    var s = tapHasPointerMoved({ clientX: 113, clientY: 100, target: document.createElement('button') });
    expect(s).toEqual(true);

    s = tapHasPointerMoved({ clientX: 87, clientY: 100, target: document.createElement('button') });
    expect(s).toEqual(true);

    s = tapHasPointerMoved({ clientX: 100, clientY: 113, target: document.createElement('button') });
    expect(s).toEqual(true);

    s = tapHasPointerMoved({ clientX: 100, clientY: 87, target: document.createElement('button') });
    expect(s).toEqual(true);

    s = tapHasPointerMoved({ clientX: 100, clientY: 200, target: document.createElement('button') });
    expect(s).toEqual(true);
  });

  it('Should tapHasPointerMoved false if less than release tolerance', function() {
    tapPointerStart = { x: 100, y: 100 };

    var s = tapHasPointerMoved({ clientX: 100, clientY: 100, target: document.createElement('button') });
    expect(s).toEqual(false);

    s = tapHasPointerMoved({ clientX: 104, clientY: 100, target: document.createElement('button') });
    expect(s).toEqual(false);

    s = tapHasPointerMoved({ clientX: 96, clientY: 100, target: document.createElement('button') });
    expect(s).toEqual(false);

    s = tapHasPointerMoved({ clientX: 100, clientY: 102, target: document.createElement('button') });
    expect(s).toEqual(false);

    s = tapHasPointerMoved({ clientX: 100, clientY: 98, target: document.createElement('button') });
    expect(s).toEqual(false);
  });

  it('Should not be tapHasPointerMoved if 0 coordinates', function() {
    var e = {
      clientX: 0,
      clientY: 0,
      target: document.createElement('input')
    };
    var s = tapHasPointerMoved(e, { clientX: 100, clientY: 100 });
    expect(s).toEqual(false);
  });

  it('Should get coordinates from page mouse event', function() {
    var e = { pageX: 77, pageY: 77 };
    var c = ionic.tap.pointerCoord(e);
    expect(c).toEqual({x:77, y: 77});
  });

  it('Should get coordinates from client mouse event', function() {
    var e = { clientX: 77, clientY: 77 };
    var c = ionic.tap.pointerCoord(e);
    expect(c).toEqual({x:77, y: 77});
  });

  it('Should get coordinates from changedTouches touches', function() {
    var e = {
      touches: [{ clientX: 99, clientY: 99 }],
      changedTouches: [{ clientX: 88, clientY: 88 }]
    };
    var c = ionic.tap.pointerCoord(e);
    expect(c).toEqual({x:88, y: 88});
  });

  it('Should get coordinates from page touches', function() {
    var e = {
      touches: [{ pageX: 99, pageY: 99 }]
    };
    var c = ionic.tap.pointerCoord(e);
    expect(c).toEqual({x:99, y: 99});
  });

  it('Should get coordinates from client touches', function() {
    var e = {
      touches: [{ clientX: 99, clientY: 99 }]
    };
    var c = ionic.tap.pointerCoord(e);
    expect(c).toEqual({x:99, y: 99});
  });

  it('Should get 0 coordinates', function() {
    var e = {};
    var c = ionic.tap.pointerCoord(e);
    expect(c).toEqual({x:0, y: 0});
  });

  it('Should not tapClick for disabled elements', function() {
    // Disabled elements should not be tapped
    var targetEle = document.createElement('input');
    targetEle.disabled = true;

    var e = {
      target: targetEle
    };

    expect( tapClick(e) ).toEqual(false);
  });

  it('Should ionic.tap.requiresNativeClick for invalid element', function() {
    expect( ionic.tap.requiresNativeClick( null ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for input.disabled', function() {
    var ele = document.createElement('input');
    ele.disabled = true;
    expect( ionic.tap.requiresNativeClick( ele ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for input[range]', function() {
    var ele = document.createElement('input');
    ele.type = 'range';
    expect( ionic.tap.requiresNativeClick( ele ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for input[file]', function() {
    var ele = document.createElement('input');
    ele.type = 'file';
    expect( ionic.tap.requiresNativeClick( ele ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for video element', function() {
    var ele = document.createElement('video');
    expect( ionic.tap.requiresNativeClick( ele ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for object element', function() {
    var ele = document.createElement('object');
    expect( ionic.tap.requiresNativeClick( ele ) ).toEqual(true);
  });

  it('Should not ionic.tap.requiresNativeClick for common inputs', function() {
    var inputTypes = ['text', 'email', 'search', 'tel', 'number', 'date', 'month', 'password', null, undefined, ''];
    for(var x=0; x<inputTypes.length; x++) {
      var targetEle = document.createElement('input');
      targetEle.type = inputTypes[x];
      expect( ionic.tap.requiresNativeClick(targetEle) ).toEqual(false);
    }
    expect( ionic.tap.requiresNativeClick( document.createElement('img') ) ).toEqual(false);
    expect( ionic.tap.requiresNativeClick( document.createElement('div') ) ).toEqual(false);
    expect( ionic.tap.requiresNativeClick( document.createElement('textarea') ) ).toEqual(false);
    expect( ionic.tap.requiresNativeClick( document.createElement('select') ) ).toEqual(false);
  });

  it('Should ionic.tap.requiresNativeClick for an element with data-tap-disabled attribute', function() {
    var div = document.createElement('div');
    expect( ionic.tap.requiresNativeClick( div ) ).toEqual(false);

    div.setAttribute('data-tap-disabled', "true");
    expect( ionic.tap.requiresNativeClick( div ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for an element with one of its parents with data-tap-disabled attribute', function() {
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');

    div1.appendChild(div2);
    div2.appendChild(div3);
    div3.appendChild(div4);
    div4.appendChild(div5);

    div2.setAttribute('data-tap-disabled', "true");

    expect( ionic.tap.requiresNativeClick( div1 ) ).toEqual(false);
    expect( ionic.tap.requiresNativeClick( div2 ) ).toEqual(true);
    expect( ionic.tap.requiresNativeClick( div3 ) ).toEqual(true);
    expect( ionic.tap.requiresNativeClick( div4 ) ).toEqual(true);
    expect( ionic.tap.requiresNativeClick( div5 ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for labels containing input[file]', function() {
    var lbl = document.createElement('label');
    var ele = document.createElement('input');
    ele.type = 'file';
    lbl.appendChild(ele);
    expect( ionic.tap.requiresNativeClick( lbl ) ).toEqual(true);
  });

  it('Should ionic.tap.requiresNativeClick for elements underneath labels containing input[file]', function() {
    var lbl = document.createElement('label');
    var txt = document.createElement('span');
    var ele = document.createElement('input');
    ele.type = 'file';
    lbl.appendChild(ele);
    lbl.appendChild(txt);
    expect( ionic.tap.requiresNativeClick( txt ) ).toEqual(true);
  });

  it('Should not allow a click that has an textarea target but not created by tapClick', function() {
    var e = {
      target: document.createElement('textarea'),
      stopPropagation: function(){ this.stoppedPropagation = true; },
      preventDefault: function(){ this.preventedDefault = true; }
    };
    tapClickGateKeeper(e);

    expect( e.stoppedPropagation ).toBeDefined();
    expect( e.preventedDefault ).toBeDefined();
  });

  it('Should allow a click that is a from an "Enter" or "Go" keypress submit', function() {
    var target = document.createElement('button');
    target.type = 'submit';
    var e = {
      target: target,
      detail: 0,
      stopPropagation: function(){ this.stoppedPropagation = true; },
      preventDefault: function(){ this.preventedDefault = true; }
    };
    tapClickGateKeeper(e);

    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should allow a click that is a tapClick', function() {
    var e = {
      target: document.createElement('input'),
      isIonicTap: true,
      stopPropagation: function(){ this.stoppedPropagation = true; },
      preventDefault: function(){ this.preventedDefault = true; }
    };
    tapClickGateKeeper(e);

    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should allow a click that is an ignore element', function() {
    var e = {
      target: document.createElement('input'),
      stopPropagation: function(){ this.stoppedPropagation = true; },
      preventDefault: function(){ this.preventedDefault = true; }
    };
    e.target.type = 'range';
    tapClickGateKeeper(e);

    expect( e.stoppedPropagation ).toBeUndefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should stopPropagation but not preventDefault on native label click that wraps text input', function() {
    // Android requires preventDefault to not be fired when a label wraps an input
    // so that when the label is tapped it brings up the keyboard
    var e = {
      target: document.createElement('label'),
      stopPropagation: function(){ this.stoppedPropagation = true; },
      preventDefault: function(){ this.preventedDefault = true; }
    };

    var input = document.createElement('textarea');
    e.target.appendChild(input);

    tapClickGateKeeper(e);

    expect( e.stoppedPropagation ).toBeDefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should stopPropagation but not preventDefault on native span click inside a label that wraps text input', function() {
    var label = document.createElement('label');
    var span = document.createElement('span');
    var textarea = document.createElement('textarea');

    label.appendChild(span);
    label.appendChild(textarea);

    var e = {
      target: span,
      stopPropagation: function(){ this.stoppedPropagation = true; },
      preventDefault: function(){ this.preventedDefault = true; }
    };

    tapClickGateKeeper(e);

    expect( e.stoppedPropagation ).toBeDefined();
    expect( e.preventedDefault ).toBeUndefined();
  });

  it('Should focus input', function() {
    var ele = {
      tagName: 'INPUT',
      focus: function(){ this.hasFocus=true; }
    };
    tapHandleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
  });

  it('Should focus textarea', function() {
    var ele = {
      tagName: 'TEXTAREA',
      focus: function(){ this.hasFocus=true; }
    };
    tapHandleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
  });

  it('Should set tapTouchFocusedInput if touch event and text input', function() {
    tapEnabledTouchEvents = true;
    var ele = {
      tagName: 'TEXTAREA'
    };
    tapHandleFocus(ele);
    expect( tapTouchFocusedInput ).toEqual(ele);
  });

  it('Should not set tapTouchFocusedInput if mouse event and text input', function() {
    tapEnabledTouchEvents = false;
    var ele = {
      tagName: 'TEXTAREA'
    };
    tapHandleFocus(ele);
    expect( tapTouchFocusedInput ).toEqual(null);
  });

  it('Should focus select', function() {
    var ele = {
      tagName: 'SELECT',
      focus: function(){ this.hasFocus=true; },
      dispatchEvent: function(){}
    };
    tapHandleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
    expect( tapTouchFocusedInput ).toEqual(null);
  });

  it('Should focus contenteditable div', function() {
    var ele = {
      tagName: 'DIV',
      isContentEditable: true,
      focus: function(){ this.hasFocus=true; },
      dispatchEvent: function(){}
    };
    tapHandleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
    expect( tapTouchFocusedInput ).toEqual(null);
  });

  it('Should not focus on common elements', function() {
    var tags = ['div', 'span', 'i', 'body', 'section', 'article', 'aside', 'li', 'p', 'header', 'button', 'ion-content'];
    function setFocus() {
      this.hasFocus = true;
    }
    for(var x=0; x<tags.length; x++) {
      var ele = {
        tagName: tags[x],
        focus: setFocus
      };
      tapHandleFocus(ele);
      expect( ele.hasFocus ).toBeUndefined();
    }
  });

  it('Should not focus on an input that already has focus', function() {
    var ele = {
      tagName: 'INPUT',
      focus: function(){ this.hasFocus=true; }
    };
    tapHandleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);

    ele.focus = function(){ this.hasSecondFocus=true; };
    tapHandleFocus(ele);
    expect( ele.hasSecondFocus ).toBeUndefined();
  });

  it('Should not focus out on common elements', function() {
    var tags = ['div', 'span', 'i', 'body', 'section', 'article', 'aside', 'li', 'p', 'header', 'button', 'ion-content'];
    function setBlurred() { this.hasBlurred = true; }
    for(var x=0; x<tags.length; x++) {
      var ele = {
        tagName: tags[x],
        blur: setBlurred
      };
      tapActiveElement(ele);
      tapFocusOutActive(ele);
      expect( ele.hasBlurred ).toBeUndefined();
    }
  });

  it('Should focus out on input elements', function() {
    var tags = ['input', 'textarea', 'select'];
    function setBlurred() { this.hasBlurred=true; }
    for(var x=0; x<tags.length; x++) {
      var ele = {
        tagName: tags[x],
        blur: setBlurred
      };
      tapActiveElement(ele);
      tapFocusOutActive(ele);
      expect( ele.hasBlurred ).toEqual(true);
    }
  });

  it('Should focus out on contenteditable elements', function() {
    var ele = {
      tagName: 'DIV',
      isContentEditable: true,
      blur: function() { this.hasBlurred=true; }
    };
    tapActiveElement(ele);
    tapFocusOutActive(ele);
    expect( ele.hasBlurred ).toEqual(true);
  });

  it('Should get containing element of label when passed a deeply nested div', function() {
    var label = document.createElement('label');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('div');
    var div4 = document.createElement('div');
    var div5 = document.createElement('div');
    var div6 = document.createElement('div');
    div6.id = 'div6';

    label.appendChild(div1);
    div1.appendChild(div2);
    div2.appendChild(div3);
    div3.appendChild(div4);
    div4.appendChild(div5);
    div5.appendChild(div6);

    // max depth
    expect( tapContainingElement(div5).tagName ).toEqual('LABEL');

    // too deep
    expect( tapContainingElement(div6).id ).toEqual('div6');
  });

  it('Should get containing element of label when passed a label', function() {
    var label = document.createElement('label');
    expect( tapContainingElement(label).tagName ).toEqual('LABEL');
  });

  it('Should get containing element of div when passed a div and no parent label', function() {
    var ele = document.createElement('div');
    expect( tapContainingElement(ele).tagName ).toEqual('DIV');
  });

  it('Should get containing element of label when passed a labels child span', function() {
    var label = document.createElement('label');
    var span = document.createElement('span');
    label.appendChild(span);
    expect( tapContainingElement(span).tagName ).toEqual('LABEL');
  });

  it('Should not return itself if no parent containing label and arg allowSelf=false', function() {
    var div = document.createElement('div');
    var span = document.createElement('span');
    div.appendChild(span);
    expect( tapContainingElement(span, false) ).toBeUndefined();
  });

  it('Should not focus out on label element which has no child input', function() {
    var label = document.createElement('label');
    label.blur = function(){ this.hasBlurred=true; };
    tapActiveElement(label);
    tapFocusOutActive(label);
    expect( label.hasBlurred ).toBeUndefined();
  });

  it('Should not prevent scrolling', function() {
    var target = document.createElement('div');
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(false);
  });

  it('Should prevent scrolling because the event has defaultedPrevented', function() {
    var target = document.createElement('div');
    var e = {
      target: target,
      defaultPrevented: true
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);
  });

  it('Should prevent scrolling because the target is input[file]', function() {
    var target = document.createElement('input');
    target.type = 'file';
    var e = {
      target: target,
      defaultPrevented: true
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);
  });

  it('Should prevent scrolling because the target is input[range]', function() {
    var target = document.createElement('input');
    target.type = 'range';
    var e = {
      target: target,
      defaultPrevented: true
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);
  });

  it('Should not prevent scrolling if the target was an input or textarea', function() {
    var target = document.createElement('input');
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(false);

    e.target = document.createElement('textarea');
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(false);

    e.target = document.createElement('select');
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(false);
  });

  it('Should not prevent scrolling if the target was an input or textarea, and the target is the same as the active element', function() {
    var target = document.createElement('input');
    tapActiveElement(target);
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(false);
  });

  it('Should not prevent scrolling if the target isContentEditable', function() {
    var target = document.createElement('div');
    target.isContentEditable = true;
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(false);
  });

  it('Should prevent scrolling if the target has dataset.preventScroll', function() {
    var target = document.createElement('div');
    target.setAttribute('data-prevent-scroll', 'true');
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);

    target = document.createElement('div');
    target.dataset.preventScroll = true;
    e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);

    target = document.createElement('div');
    target.dataset.preventScroll = 'true';
    e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);
  });

  it('Should prevent scrolling if the browser doesnt support dataset but target has data-prevent-scroll attribute', function() {
    var target = {
      tagName: 'div',
      getAttribute: function(val) {
        if(val === 'data-prevent-scroll') {
          return 'true';
        }
      }
    };
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);
  });

  it('Should prevent scrolling if the target is an object or embed', function() {
    var target = document.createElement('object');
    var e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);

    target = document.createElement('embed');
    e = {
      target: target
    };
    expect( ionic.tap.ignoreScrollStart(e) ).toEqual(true);
  });

  it('Should get target element from an element', function() {
    var ele = document.createElement('div');
    expect( tapTargetElement(ele).tagName ).toEqual('DIV');
  });

  it('Should get labels input control from label element', function() {
    var label = document.createElement('label');
    var input = document.createElement('input');
    label.appendChild(input);

    expect( tapTargetElement(label).tagName ).toEqual('INPUT');
  });

  it('Should get button target even if it has children from es target', function() {
    var button = document.createElement('button');
    var span = document.createElement('span');
    button.appendChild(span);

    expect( tapTargetElement(button).tagName ).toEqual('BUTTON');
  });

  it('Should isTextInput', function() {
    expect( ionic.tap.isTextInput(null) ).toEqual(false);

    var ele = document.createElement('textarea');
    expect( ionic.tap.isTextInput(ele) ).toEqual(true);

    ele = document.createElement('input');
    expect( ionic.tap.isTextInput(ele) ).toEqual(true);

    ele.type = 'search';
    expect( ionic.tap.isTextInput(ele) ).toEqual(true);

    ele.type = 'url';
    expect( ionic.tap.isTextInput(ele) ).toEqual(true);

    ele.type = 'email';
    expect( ionic.tap.isTextInput(ele) ).toEqual(true);

    ele.type = 'range';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'file';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'submit';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'reset';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'radio';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'checkbox';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'color';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'button';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele.type = 'image';
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele = document.createElement('select');
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);

    ele = document.createElement('div');
    ele.setAttribute('contenteditable', true);
    expect( ionic.tap.isTextInput(ele) ).toEqual(true);

    ele = document.createElement('div');
    ele.setAttribute('contenteditable', false);
    expect( ionic.tap.isTextInput(ele) ).toEqual(false);
  });

  it('Should isDateInput', function() {
    expect( ionic.tap.isDateInput(null) ).toEqual(false);

    ele = { tagName: 'INPUT' };

    ele.type = 'date';
    expect( ionic.tap.isDateInput(ele) ).toEqual(true);

    ele.type = 'datetime-local';
    expect( ionic.tap.isDateInput(ele) ).toEqual(true);

    ele.type = 'month';
    expect( ionic.tap.isDateInput(ele) ).toEqual(true);

    ele.type = 'week';
    expect( ionic.tap.isDateInput(ele) ).toEqual(true);

    ele.type = 'time';
    expect( ionic.tap.isDateInput(ele) ).toEqual(true);

    ele.type = 'checkbox';
    expect( ionic.tap.isDateInput(ele) ).toEqual(false);

    ele.type = '';
    expect( ionic.tap.isDateInput(ele) ).toEqual(false);

    ele.type = 'text';
    expect( ionic.tap.isDateInput(ele) ).toEqual(false);
  });

  it('Should isKeyboardElement on date and select on iPhone', function() {
    expect( ionic.tap.isKeyboardElement(null) ).toEqual(false);

    ionic.Platform.setPlatform('ios');

    var ele = document.createElement('input');
    ele.type = 'date';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(true);

    ele.type = 'datetime-local';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(true);

    ele.type = 'month';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(true);

    ele.type = 'week';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(true);

    ele.type = 'time';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(true);

    ele = document.createElement('select');
    expect ( ionic.tap.isKeyboardElement(ele)).toEqual(true);

  });

  it('Should not isKeyboardElement on date and select on Android and iPad', function() {

    expect( ionic.tap.isKeyboardElement(null) ).toEqual(false);

    ionic.Platform.setPlatform('android');

    var ele = { type:'date'};
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'datetime-local';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'month';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'week';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'time';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele = {};
    expect ( ionic.tap.isKeyboardElement(ele)).toEqual(false);

    ionic.Platform.setPlatform('ios');
    ionic.Platform.ua = 'iPad';

    ele = {};
    ele.type = 'date';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'datetime-local';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'month';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'week';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele.type = 'time';
    expect( ionic.tap.isKeyboardElement(ele) ).toEqual(false);

    ele = {};
    expect ( ionic.tap.isKeyboardElement(ele)).toEqual(false);
  });

  it('Should isLabelWithTextInput', function() {
    var label = document.createElement('label');
    expect( ionic.tap.isLabelWithTextInput(label) ).toEqual(false);

    var span = document.createElement('span');
    expect( ionic.tap.isLabelWithTextInput(span) ).toEqual(false);

    label.appendChild(span);
    expect( ionic.tap.isLabelWithTextInput(span) ).toEqual(false);

    var textarea = document.createElement('textarea');
    expect( ionic.tap.isLabelWithTextInput(textarea) ).toEqual(false);

    label.appendChild(textarea);
    expect( ionic.tap.isLabelWithTextInput(textarea) ).toEqual(true);
  });

  it('Should containsOrIsTextInput', function() {
    var label = document.createElement('label');
    expect( ionic.tap.containsOrIsTextInput(label) ).toEqual(false);

    var span = document.createElement('span');
    expect( ionic.tap.containsOrIsTextInput(span) ).toEqual(false);

    label.appendChild(span);
    expect( ionic.tap.containsOrIsTextInput(span) ).toEqual(false);

    var textarea = document.createElement('textarea');
    expect( ionic.tap.containsOrIsTextInput(textarea) ).toEqual(true);

    label.appendChild(textarea);
    expect( ionic.tap.containsOrIsTextInput(textarea) ).toEqual(true);
  });

  it('Should reset focus to tapTouchFocusedInput if the active element changed from mousedown', function() {
    tapEnabledTouchEvents = true;
    tapActiveElement(document.createElement('textarea'));

    var tapFocusedEle = document.createElement('input');
    tapFocusedEle.focus = function(){
      this.hasFocus = true;
    };

    tapTouchFocusedInput = tapFocusedEle;

    var e = {
      target: document.createElement('input')
    };
    tapFocusIn(e);

    expect( tapFocusedEle.hasFocus ).toEqual(true);
    expect( tapTouchFocusedInput ).toEqual(null);
  });

  it('Should tapIgnoreEvent false', function(){
    var e = {};
    expect( tapIgnoreEvent(e) ).toBeUndefined();
  });

  it('Should tapIgnoreEvent true because e.isTapHandled', function(){
    var e = {
      isTapHandled: true
    };
    expect( tapIgnoreEvent(e) ).toEqual(true);
  });

  it('Should tapIgnoreEvent true because ionic.scroll.isScrolling and target is a text input', function(){
    var target = document.createElement('textarea');
    var e = {
      target: target,
      preventDefault: function(){ this.preventedDefault=true; }
    };
    ionic.scroll.isScrolling = true;
    expect( tapIgnoreEvent(e) ).toEqual(true);
    expect( e.preventedDefault ).toEqual(true);
  });

  it('Should tapIgnoreEvent true because ionic.scroll.isScrolling and target is span in a label containing a text input', function(){
    var label = document.createElement('label');
    var span = document.createElement('span');
    var textarea = document.createElement('textarea');

    label.appendChild(span);
    label.appendChild(textarea);

    var e = {
      target: label,
      preventDefault: function(){ this.preventedDefault=true; }
    };
    ionic.scroll.isScrolling = true;
    expect( tapIgnoreEvent(e) ).toEqual(true);
    expect( e.preventedDefault ).toEqual(true);
  });

  it('Should tapIgnoreEvent false because ionic.scroll.isScrolling but target is not a text input', function(){
    var target = document.createElement('span');
    var e = {
      target: target,
      preventDefault: function(){ this.preventedDefault=true; }
    };
    ionic.scroll.isScrolling = true;
    expect( tapIgnoreEvent(e) ).toBeUndefined();
  });

  it('Should tapIgnoreEvent false because ionic.scroll.isScrolling but target is a input[checkbox]', function(){
    var label = document.createElement('label');
    var span = document.createElement('span');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    label.appendChild(span);
    label.appendChild(checkbox);

    var e = {
      target: span,
      preventDefault: function(){ this.preventedDefault=true; }
    };
    ionic.scroll.isScrolling = true;
    expect( tapIgnoreEvent(e) ).toBeUndefined();
  });

});
