describe('SideMenuController', function() {
  var ctrl, l, r, c;

  var Controller = function(opts) {
    this.el = opts.el;
    this.animateClass = opts.animateClass;
  };
  Controller.prototype = {
    getTranslateX: function() {
      var r = /translate3d\((-?.+)px/;
      var d = r.exec(this.el.style.webkitTransform);

      if(d && d.length > 0) {
        return parseFloat(d[1]);
      }
      return 0;
    },
    setTranslateX: function(amount) {
      this.el.style.webkitTransform = 'translate3d(' + amount + 'px, 0, 0)';
    },
    enableAnimation: function() {
      this.el.classList.add(this.animateClass);
    },
    disableAnimation: function() {
      this.el.classList.remove(this.animateClass);
    }
  };

  beforeEach(function() {
    l = new ionic.views.SideMenu({ el: document.createElement('div'), width: 270 });
    r = new ionic.views.SideMenu({ el: document.createElement('div'), width: 270 });
    c = new Controller({ el: document.createElement('div') });

    ctrl = new ionic.controllers.SideMenuController({
      left: l,
      right: r,
      content: c
    });
  });

  // Init
  it('Should init', function() {
    expect(ctrl.left).toBe(l);
    expect(ctrl.right).toBe(r);
    expect(ctrl.content).toBe(c);
  });

  // Menu enable/disable
  it('Should set enabled/disabled', function() {
    var left = ctrl.left;
    var right = ctrl.right;
    left.setIsEnabled(false);
    right.setIsEnabled(false);
    expect(left.isEnabled).toEqual(false);
    expect(right.isEnabled).toEqual(false);
    left.setIsEnabled(true);
    right.setIsEnabled(true);
    expect(left.isEnabled).toEqual(true);
    expect(right.isEnabled).toEqual(true);
  });

  // Menu widths
  it('Should init widths', function() {
    var left = ctrl.left;
    var right = ctrl.right;
    expect(left.width).toEqual(270);
    expect(right.width).toEqual(270);
  });

  it('Should have amount and percentage correct', function() {
    ctrl.openAmount(l.width/2);
    expect(ctrl.getOpenAmount()).toEqual(l.width/2);
    expect(ctrl.getOpenPercentage()).toEqual(50);

    ctrl.openAmount(l.width/4);
    expect(ctrl.getOpenAmount()).toEqual(l.width/4);
    expect(ctrl.getOpenPercentage()).toEqual(25);

    ctrl.openAmount(-r.width/2);
    expect(ctrl.getOpenAmount()).toEqual(-r.width/2);
    expect(ctrl.getOpenPercentage()).toEqual(-50);
  });

  // Open
  it('Should toggle left and right', function() {
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(-100);
  });
  
  // Snap
  it('Should snap', function() {

    // Center to right, Going right, less than half, too slow (snap back)
    ctrl.openAmount(10);
    ctrl.snapToRest({
      gesture: {
        velocityX: 0,
        direction: 'right'
      }
    });
    expect(ctrl.getOpenPercentage()).toEqual(0);

    // Right to left, Going left, more than half, too slow (snap back)
    ctrl.openPercentage(51);
    ctrl.snapToRest({
      gesture: {
        velocityX: 0,
        direction: 'left'
      }
    });
    expect(ctrl.getOpenPercentage()).toEqual(100);

    // Right to left, Going left, less than half, too slow (snap back)
    ctrl.openAmount(10);
    ctrl.snapToRest({
      gesture: {
        velocityX: 0,
        direction: 'left'
      }
    });
    expect(ctrl.getOpenPercentage()).toEqual(0);

    // Left to right, Going right, more than half, too slow (snap back)
    ctrl.openPercentage(-51);
    ctrl.snapToRest({
      gesture: {
        velocityX: 0,
        direction: 'right'
      }
    });
    expect(ctrl.getOpenPercentage()).toEqual(-100);
      
    // Going right, more than half, or quickly (snap open)
    ctrl.openPercentage(-51);
    ctrl.snapToRest({
      gesture: {
        velocityX: 1,
        direction: 'right'
      }
    });
    expect(ctrl.getOpenPercentage()).toEqual(0);

    // Going left, more than half, or quickly (snap open)
    ctrl.openPercentage(-51);
    ctrl.snapToRest({
      gesture: {
        velocityX: 1,
        direction: 'left'
      }
    });
    expect(ctrl.getOpenPercentage()).toEqual(-100);
  });

  it('Should test content drag events', function() {
  });
});
