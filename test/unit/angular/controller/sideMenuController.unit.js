describe('$ionicSideMenus controller', function() {
  var ctrl;

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

  beforeEach(module('ionic'));

  beforeEach(function(){

    inject(function($controller, $rootScope) {
      var scope = $rootScope.$new();
      ctrl = $controller('$ionicSideMenus', angular.extend({
        $scope: scope,
        $attrs: {}
      }, {}));
      angular.extend(ctrl, {});
      ctrl.left = new ionic.views.SideMenu({
        width: 270,
        el: document.createElement('div'),
        isEnabled: true
      });
      ctrl.right = new ionic.views.SideMenu({
        width: 270,
        el: document.createElement('div'),
        isEnabled: true
      });
      var content = new Controller({ el: document.createElement('div') });
      content.setMarginLeft = function(){};
      content.setMarginRight = function(){};
      content.setMarginLeftAndRight = function(){};
      content.setCanScroll = function(){};
      ctrl.setContent(content);
    });

  });

  // Menu enable/disable
  it('should set enabled/disabled', function() {
    ctrl.left.setIsEnabled(false);
    ctrl.right.setIsEnabled(false);
    expect(ctrl.left.isEnabled).toEqual(false);
    expect(ctrl.right.isEnabled).toEqual(false);
    ctrl.left.setIsEnabled(true);
    ctrl.right.setIsEnabled(true);
    expect(ctrl.left.isEnabled).toEqual(true);
    expect(ctrl.right.isEnabled).toEqual(true);
  });

  // Menu widths
  it('should init widths', function() {
    expect(ctrl.left.width).toEqual(270);
    expect(ctrl.right.width).toEqual(270);
  });

  it('should have amount and percentage correct', function() {
    ctrl.openAmount(ctrl.left.width/2);
    expect(ctrl.getOpenAmount()).toEqual(ctrl.left.width/2);
    expect(ctrl.getOpenPercentage()).toEqual(50);

    ctrl.openAmount(ctrl.left.width/4);
    expect(ctrl.getOpenAmount()).toEqual(ctrl.left.width/4);
    expect(ctrl.getOpenPercentage()).toEqual(25);

    ctrl.openAmount(-ctrl.right.width/2);
    expect(ctrl.getOpenAmount()).toEqual(-ctrl.right.width/2);
    expect(ctrl.getOpenPercentage()).toEqual(-50);
  });

  it('should add/remove menu-open from the body class', inject(function($document) {
    expect($document[0].body.classList.contains('menu-open')).toEqual(false);
    ctrl.openPercentage(100);
    expect($document[0].body.classList.contains('menu-open')).toEqual(true);
    ctrl.openPercentage(0);
    expect($document[0].body.classList.contains('menu-open')).toEqual(false);
  }));

  // Open
  it('should toggle left', function() {
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should toggle, default left', function() {
    ctrl.toggle();
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.toggle();
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should toggle with "left" param', function() {
    ctrl.toggle('left');
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.toggle('left');
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should toggle with "right" param', function() {
    ctrl.toggle('right');
    expect(ctrl.getOpenPercentage()).toEqual(-100);
    ctrl.toggle('right');
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should not toggle left with exposed aside', function() {
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.exposeAside(true);
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should not toggle right with exposed aside', function() {
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.exposeAside(true);
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should not toggle left when disabled', function() {
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.left.isEnabled = false;
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.left.isEnabled = true;
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toNotEqual(0);
  });

  it('should not toggle right when disabled', function() {
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.right.isEnabled = false;
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.right.isEnabled = true;
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toNotEqual(0);
  });

  it('should close left menu on expose aside', function() {
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.exposeAside(true);
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should close right menu on expose aside', function() {
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(-100);
    ctrl.exposeAside(true);
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should set enabled/disabled exposeAside', function() {
    expect(ctrl.isAsideExposed()).toEqual(false);
    ctrl.left.setIsEnabled(false);
    ctrl.right.setIsEnabled(false);
    ctrl.exposeAside(true);
    expect(ctrl.isAsideExposed()).toEqual(false);
    ctrl.left.setIsEnabled(true);
    ctrl.exposeAside(true);
    expect(ctrl.isAsideExposed()).toEqual(true);
  });

  it('should toggle right', function() {
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(-100);
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(-100);
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(0);
  });

  it('should isOpen', function() {
    expect(ctrl.isOpen()).toEqual(false);
    ctrl.toggleLeft();
    expect(ctrl.isOpen()).toEqual(true);
    ctrl.toggleLeft();
    expect(ctrl.isOpen()).toEqual(false);
    ctrl.toggleLeft();
    expect(ctrl.isOpen()).toEqual(true);
    ctrl.toggleLeft();

    expect(ctrl.isOpen()).toEqual(false);
    ctrl.toggleRight();
    expect(ctrl.isOpen()).toEqual(true);
    ctrl.toggleRight();
    expect(ctrl.isOpen()).toEqual(false);
    ctrl.toggleRight();
    expect(ctrl.isOpen()).toEqual(true);
  });


  it('should isOpenLeft', function() {
    expect(ctrl.isOpenLeft()).toEqual(false);
    ctrl.toggleLeft();
    expect(ctrl.isOpenLeft()).toEqual(true);
    ctrl.toggleLeft();
    expect(ctrl.isOpenLeft()).toEqual(false);
    ctrl.toggleLeft();
    expect(ctrl.isOpenLeft()).toEqual(true);
  });

  it('should isOpenRight', function() {
    expect(ctrl.isOpenRight()).toEqual(false);
    ctrl.toggleRight();
    expect(ctrl.isOpenRight()).toEqual(true);
    ctrl.toggleRight();
    expect(ctrl.isOpenRight()).toEqual(false);
    ctrl.toggleRight();
    expect(ctrl.isOpenRight()).toEqual(true);
  });

  // Snap
  it('should snap', function() {

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

  it('should register with backButton on open and dereg on close', inject(function($ionicPlatform, IONIC_BACK_PRIORITY) {
    var openAmount = 0;
    var deregSpy = jasmine.createSpy('deregister');
    spyOn($ionicPlatform, 'registerBackButtonAction').andReturn(deregSpy);

    spyOn(ctrl, 'getOpenAmount').andCallFake(function() { return openAmount; });

    expect($ionicPlatform.registerBackButtonAction).not.toHaveBeenCalled();
    openAmount = 1;
    ctrl.$scope.$apply();
    expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalledWith(
      jasmine.any(Function),
      IONIC_BACK_PRIORITY.sideMenu
    );
    expect(deregSpy).not.toHaveBeenCalled();
    openAmount = 0;
    ctrl.$scope.$apply();
    expect(deregSpy).toHaveBeenCalled();
  }));

  it('should emit $ionicSideMenuOpen on open and $ionicSideMenuClose on close', inject(function($rootScope){
    // create spies and event listeners
    var openSpy = jasmine.createSpy('openSpy');
    $rootScope.$on('$ionicSideMenuOpen', openSpy);
    var closeSpy = jasmine.createSpy('openSpy');
    $rootScope.$on('$ionicSideMenuClose', closeSpy);

    // left open
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(100);
    ctrl.$scope.$apply();
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy.mostRecentCall.args[1]).toEqual("left");

    // left close
    ctrl.toggleLeft();
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.$scope.$apply();
    expect(closeSpy).toHaveBeenCalled();
    expect(closeSpy.mostRecentCall.args[1]).toEqual("left");

    // right open
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(-100);
    ctrl.$scope.$apply();
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy.mostRecentCall.args[1]).toEqual("right");

    // right close
    ctrl.toggleRight();
    expect(ctrl.getOpenPercentage()).toEqual(0);
    ctrl.$scope.$apply();
    expect(closeSpy).toHaveBeenCalled();
    expect(closeSpy.mostRecentCall.args[1]).toEqual("right");
  }));


  it('should deregister back button action on $destroy', inject(function($ionicPlatform) {
    var openAmount = 0;
    var deregSpy = jasmine.createSpy('deregister');
    spyOn($ionicPlatform, 'registerBackButtonAction').andReturn(deregSpy);

    spyOn(ctrl, 'getOpenAmount').andCallFake(function() { return openAmount; });

    expect($ionicPlatform.registerBackButtonAction).not.toHaveBeenCalled();
    openAmount = 1;
    ctrl.$scope.$apply();
    expect(deregSpy).not.toHaveBeenCalled();
    ctrl.$scope.$destroy();
    expect(deregSpy).toHaveBeenCalled();
  }));
});
