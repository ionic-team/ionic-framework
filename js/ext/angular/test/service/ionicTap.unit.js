describe('Ionic Tap', function() {

  beforeEach(function() {
    window.console.debug = function(){};
    ionic.tap.reset();
  });

  it('Should focus on an input if it hasnt scrolled', function() {
    var targetEle = {
      dispatchEvent: function() {},
      focus: function() { this.isFocused = true; }
    };

    ionic.tap.setTouchStart({clientX: 100, clientY: 100});

    targetEle.tagName = 'INPUT';
    var e = {
      clientX: 100, clientY: 100,
      preventDefault: function() {}
    };
    ionic.tap.simulateClick(targetEle, e);

    expect(targetEle.isFocused).toEqual(true);
  });

  it('Should preventDefault on an input', function() {
    var targetEle = {
      dispatchEvent: function() {},
      focus: function() {}
    };

    ionic.tap.setTouchStart({ clientX: 100, clientY: 100 });
    var e = {
      clientX: 100, clientY: 100,
      preventDefault: function() { this.preventedDefault = true }
    };

    targetEle.tagName = 'INPUT';
    ionic.tap.simulateClick(targetEle, e);
    expect(e.preventedDefault).toEqual(true);
    e.preventedDefault = false;

    targetEle.tagName = 'TEXTAREA';
    ionic.tap.simulateClick(targetEle, e);
    expect(e.preventedDefault).toEqual(true);
    e.preventedDefault = false;

    targetEle.tagName = 'DIV';
    ionic.tap.simulateClick(targetEle, e);
    expect(e.preventedDefault).toEqual(false);
    e.preventedDefault = false;
  });

  it('Should setTouchStart and hasTouchScrolled true if >= touch tolerance', function() {
    ionic.tap.setTouchStart({ clientX: 100, clientY: 100 });

    var s = ionic.tap.hasTouchScrolled({ clientX: 111, clientY: 100 });
    expect(s).toEqual(true);

    s = ionic.tap.hasTouchScrolled({ clientX: 89, clientY: 100 });
    expect(s).toEqual(true);

    s = ionic.tap.hasTouchScrolled({ clientX: 100, clientY: 107 });
    expect(s).toEqual(true);

    s = ionic.tap.hasTouchScrolled({ clientX: 100, clientY: 93 });
    expect(s).toEqual(true);

    s = ionic.tap.hasTouchScrolled({ clientX: 100, clientY: 200 });
    expect(s).toEqual(true);
  });

  it('Should setTouchStart and hasTouchScrolled false if less than touch tolerance', function() {
    ionic.tap.setTouchStart({ clientX: 100, clientY: 100 });

    var s = ionic.tap.hasTouchScrolled({ clientX: 100, clientY: 100 });
    expect(s).toEqual(false);

    s = ionic.tap.hasTouchScrolled({ clientX: 104, clientY: 100 });
    expect(s).toEqual(false);

    s = ionic.tap.hasTouchScrolled({ clientX: 96, clientY: 100 });
    expect(s).toEqual(false);

    s = ionic.tap.hasTouchScrolled({ clientX: 100, clientY: 102 });
    expect(s).toEqual(false);

    s = ionic.tap.hasTouchScrolled({ clientX: 100, clientY: 98 });
    expect(s).toEqual(false);
  });

  it('Should not be hasTouchScrolled if 0 coordinates', function() {
    var s = ionic.tap.hasTouchScrolled({ clientX: 0, clientY: 0 });
    expect(s).toEqual(false);
  });

  it('Should dispatch a mouse event', function() {
    var targetEle = {
      dispatchEvent: function(clickEvent) {
        this.clickEvent = clickEvent;
      }
    };
    var e = { clientX: 99, clientY: 88 };
    ionic.tap.simulateClick(targetEle, e);

    expect(targetEle.clickEvent.clientX).toEqual(99);
    expect(targetEle.clickEvent.clientY).toEqual(88);
  });

  it('Should get coordinates from client originalEvent changedTouches', function() {
    var e = {
      clientX: 99,
      clientY: 99,
      originalEvent: {
        changedTouches: [{ clientX: 77, clientY: 77 }]
      }
    };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:77, y: 77});
  });

  it('Should get coordinates from client mouse originalEvent', function() {
    var e = {
      clientX: 99,
      clientY: 99,
      originalEvent: {
        clientX: 88,
        clientY: 88,
      }
    };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:88, y: 88});
  });

  it('Should get coordinates from page mouse event', function() {
    var e = { pageX: 77, pageY: 77 };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:77, y: 77});
  });

  it('Should get coordinates from client mouse event', function() {
    var e = { clientX: 77, clientY: 77 };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:77, y: 77});
  });

  it('Should get coordinates from changedTouches touches', function() {
    var e = {
      touches: [{ clientX: 99, clientY: 99 }],
      changedTouches: [{ clientX: 88, clientY: 88 }]
    };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:88, y: 88});
  });

  it('Should get coordinates from page touches', function() {
    var e = {
      touches: [{ pageX: 99, pageY: 99 }]
    };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:99, y: 99});
  });

  it('Should get coordinates from client touches', function() {
    var e = {
      touches: [{ clientX: 99, clientY: 99 }]
    };
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:99, y: 99});
  });

  it('Should get 0 coordinates', function() {
    var e = {};
    var c = ionic.tap.getCoordinates(e);
    expect(c).toEqual({x:0, y: 0});
  });

  it('Should not fire a tap for disabled elements', function() {
    // Disabled elements should not be tapped
    var targetEle = document.createElement('input');
    targetEle.disabled = true;
    var event = {};
    ionic.tap.simulateClick(targetEle, event);
    expect(event.tapIgnored).toEqual(true);
  });

  it('Should not fire a tap for input[file] elements', function() {
    // Reported that on Android input[file] does not open using the tap
    var targetEle = document.createElement('input');
    targetEle.type = 'file';
    var event = {};
    ionic.tap.simulateClick(targetEle, event);
    expect(event.tapIgnored).toEqual(true);
  });

  it('Should not fire a tap for input[range] elements', function() {
    // Range and tap do not agree, probably because it doesn't have a delay to begin with
    var targetEle = document.createElement('input');
    targetEle.type = 'range';
    var event = {};
    ionic.tap.simulateClick(targetEle, event);
    expect(event.tapIgnored).toEqual(true);
  });

});
