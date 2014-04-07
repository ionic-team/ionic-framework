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

  it('Should correctly check for tap elements', function() {
    expect(ionic.tap.isTapElement('A')).toEqual(true);
    expect(ionic.tap.isTapElement('INPUT')).toEqual(true);
    expect(ionic.tap.isTapElement('BUTTON')).toEqual(true);
    expect(ionic.tap.isTapElement('LABEL')).toEqual(true);
    expect(ionic.tap.isTapElement('TEXTAREA')).toEqual(true);
    expect(ionic.tap.isTapElement('SELECT')).toEqual(true);

    expect(ionic.tap.isTapElement('DIV')).toEqual(false);
    expect(ionic.tap.isTapElement('SPAN')).toEqual(false);
    expect(ionic.tap.isTapElement('I')).toEqual(false);
    expect(ionic.tap.isTapElement('BODY')).toEqual(false);
    expect(ionic.tap.isTapElement('SECTION')).toEqual(false);
    expect(ionic.tap.isTapElement('ASIDE')).toEqual(false);
    expect(ionic.tap.isTapElement('LI')).toEqual(false);
    expect(ionic.tap.isTapElement('P')).toEqual(false);
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

});
