describe('$ionSlideBox controller', function() {
  beforeEach(module('ionic'));
  beforeEach(function() {
    ionic.animationFrameThrottle = function(cb) {
      return function() {
        cb.apply(this, arguments);
      };
    };
  });


  function mockSlide(slideBoxCtrl) {
    var slideCtrl = {
      setState: jasmine.createSpy('setState'),
      transform: jasmine.createSpy('transform')
    };
    var slide = angular.element('<ion-slide>');
    slide.data('$ionSlideController', slideCtrl);
    slideBoxCtrl.element.append(slide);
    return slideCtrl;
  }
  function makeCtrl(locals) {
    var ctrl;
    inject(function($controller, $rootScope) {
      ctrl = $controller('$ionSlideBox', extend({
        $scope: $rootScope.$new(),
        $element: angular.element('<div class="slider"><div class="slider-slides"></div></div>')
      }, locals));
    });
    return ctrl;
  }

  it('#onDrag()', function() {
    var ctrl = makeCtrl();
    var slide0 = mockSlide(ctrl);
    var slide1 = mockSlide(ctrl);
    var slide2 = mockSlide(ctrl);

    ctrl.select(1);
    // Transforming forward should move current and next
    ctrl.onDrag(0.5);
    expect(slide0.transform).not.toHaveBeenCalled();
    expect(slide1.transform).toHaveBeenCalledWith(0.5);
    expect(slide2.transform).toHaveBeenCalledWith(0.5);

    slide0.transform.reset();
    slide1.transform.reset();
    slide2.transform.reset();

    // Transforming backward should move current and prev
    ctrl.onDrag(-0.5);
    expect(slide0.transform).toHaveBeenCalledWith(-0.5);
    expect(slide1.transform).toHaveBeenCalledWith(-0.5);
    expect(slide2.transform).not.toHaveBeenCalled();
  });

  it('#onDragEnd()', function() {
    var ctrl = makeCtrl();
    var slide0 = mockSlide(ctrl);
    var slide1 = mockSlide(ctrl);
    var slide2 = mockSlide(ctrl);

    ctrl.select(1);
    // Greater than 0.5 should change slide
    ctrl.onDragEnd(-0.75, 0);
    expect(ctrl.selected()).toBe(0);
    ctrl.onDragEnd(0.75, 0);
    expect(ctrl.selected()).toBe(1);
    // Less shouldn't
    ctrl.onDragEnd(0.25, 0);
    expect(ctrl.selected()).toBe(1);
  });

  it('#isRelevant()', function() {
    var ctrl = makeCtrl();
    for (var i = 0; i < 5; i++) {
      mockSlide(ctrl);
    }

    ctrl.loop(false);
    ctrl.select(0);
    expect(ctrl.isRelevant(4)).toBe(false);
    expect(ctrl.isRelevant(0)).toBe(true);
    expect(ctrl.isRelevant(1)).toBe(true);
    expect(ctrl.isRelevant(2)).toBe(false);

    ctrl.loop(true);
    expect(ctrl.isRelevant(3)).toBe(false);
    expect(ctrl.isRelevant(4)).toBe(true);
    expect(ctrl.isRelevant(0)).toBe(true);
    expect(ctrl.isRelevant(1)).toBe(true);
    expect(ctrl.isRelevant(2)).toBe(false);
  });

  it('#previous()', function() {
    var ctrl = makeCtrl();
    for (var i = 0; i < 3; i++) {
      mockSlide(ctrl);
    }

    ctrl.loop(false);
    ctrl.select(0);
    expect(ctrl.previous()).toBe(-1);
    ctrl.select(1);
    expect(ctrl.previous()).toBe(0);

    ctrl.loop(true);
    ctrl.select(0);
    expect(ctrl.previous()).toBe(2);
    ctrl.select(1);
    expect(ctrl.previous()).toBe(0);
  });

  it('#next()', function() {
    var ctrl = makeCtrl();
    for (var i = 0; i < 3; i++) {
      mockSlide(ctrl);
    }

    ctrl.loop(false);
    ctrl.select(2);
    expect(ctrl.next()).toBe(-1);
    ctrl.select(1);
    expect(ctrl.next()).toBe(2);

    ctrl.loop(true);
    ctrl.select(2);
    expect(ctrl.next()).toBe(0);
    ctrl.select(1);
    expect(ctrl.next()).toBe(2);
  });

});
