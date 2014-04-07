describe('Ionic Tap', function() {

  beforeEach(function() {
    window.console.debug = function(){};
    ionic.tap.reset();
    window._setTimeout = window.setTimeout;
    window.setTimeout = function(){};
  });

  afterEach(function(){
    window.setTimeout = window._setTimeout;
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
      },
      tagName: 'LABEL'
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

  it('Should ignoreSimulateClick for disabled elements', function() {
    // Disabled elements should not be tapped
    var targetEle = document.createElement('input');
    targetEle.disabled = true;
    expect( ionic.tap.ignoreSimulateClick(targetEle) ).toEqual(true);
  });

  it('Should ignoreSimulateClick for input[range] elements', function() {
    // Range and tap do not agree, probably because it doesn't have a delay to begin with
    var targetEle = document.createElement('input');
    targetEle.type = 'range';
    expect( ionic.tap.ignoreSimulateClick(targetEle) ).toEqual(true);
  });

  it('Should not ignoreSimulateClick for common inputs', function() {
    var inputTypes = ['text', 'email', 'search', 'tel', 'number', 'date', 'month', 'password', null, undefined, ''];
    for(var x=0; x<inputTypes.length; x++) {
      var targetEle = document.createElement('input');
      targetEle.type = inputTypes[x];
      expect( ionic.tap.ignoreSimulateClick(targetEle) ).toEqual(false);
    }
    expect( ionic.tap.ignoreSimulateClick( document.createElement('div') ) ).toEqual(false);
    expect( ionic.tap.ignoreSimulateClick( document.createElement('textarea') ) ).toEqual(false);
    expect( ionic.tap.ignoreSimulateClick( document.createElement('select') ) ).toEqual(false);
  });

  it('Should be a tap element', function() {
    var tags = ['A', 'INPUT', 'BUTTON', 'LABEL', 'TEXTAREA', 'SELECT'];
    for(var x=0; x<tags.length; x++) {
      expect(ionic.tap.isTapElement( tags[x] )).toEqual(true);
    }
  });

  it('Should not be a tap element', function() {
    var tags = ['DIV', 'SPAN', 'I', 'LI', 'P', 'BODY', 'SECTION', 'ASIDE', 'HEADER', 'FOOTER', 'ARTICLE'];
    for(var x=0; x<tags.length; x++) {
      expect(ionic.tap.isTapElement( tags[x] )).toEqual(false);
    }
  });

  it('Should focus input', function() {
    var ele = {
      tagName: 'input',
      focus: function(){ this.hasFocus=true; }
    }
    ionic.tap.handleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
  });

  it('Should focus textarea', function() {
    var ele = {
      tagName: 'textarea',
      focus: function(){ this.hasFocus=true; }
    }
    ionic.tap.handleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
  });

  it('Should focus select', function() {
    var ele = {
      tagName: 'select',
      focus: function(){ this.hasFocus=true; }
    }
    ionic.tap.handleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);
  });

  it('Should not focus on common elements', function() {
    var tags = ['div', 'span', 'i', 'body', 'section', 'article', 'aside', 'li', 'p', 'header', 'button', 'ion-content'];
    for(var x=0; x<tags.length; x++) {
      var ele = {
        tagName: tags[x],
        focus: function(){ this.hasFocus=true; }
      }
      ionic.tap.handleFocus(ele);
      expect( ele.hasFocus ).toBeUndefined();
    }
  });

  it('Should not focus on an input that already has focus', function() {
    var ele = {
      tagName: 'input',
      focus: function(){ this.hasFocus=true; }
    }
    ionic.tap.handleFocus(ele);
    expect( ele.hasFocus ).toEqual(true);

    ele.focus = function(){ this.hasSecondFocus=true }
    ionic.tap.handleFocus(ele);
    expect( ele.hasSecondFocus ).toBeUndefined();
  });

  it('Should recordCoordinates and isRecentTap', function() {
    var e = {
      clientX: 100,
      clientY: 100
    };
    expect( ionic.tap.isRecentTap(e) ).toBeUndefined();
    ionic.tap.recordCoordinates(e);
    expect( ionic.tap.isRecentTap(e) ).toBeDefined();
  });

  it('Should ignoreTapInspect because of isRecentTap', function() {
    var e = {
      type: 'touchend',
      clientX: 100,
      clientY: 100
    };
    ionic.tap.recordCoordinates(e);
    expect( ionic.tap.ignoreTapInspect(e) ).toEqual(true);
  });

  it('Should ignoreTapInspect because of hasTouchScrolled', function() {
    ionic.tap.setTouchStart({ clientX: 100, clientY: 100 });
    var e = {
      type: 'touchend',
      clientX: 200,
      clientY: 200
    };
    expect( ionic.tap.ignoreTapInspect(e) ).toEqual(true);
  });

  it('Should ignoreTapInspect because of touchcancel event', function() {
    var e = {
      type: 'touchcancel'
    };
    expect( ionic.tap.ignoreTapInspect(e) ).toEqual(true);
  });

  it('Should not ignoreTapInspect', function() {
    var e = {
      type: 'touchend'
    };
    expect( ionic.tap.ignoreTapInspect(e) ).toEqual(false);
  });

});
