describe('$ionSlideBox controller', function() {
  beforeEach(module('ionic'));


  function mockSlide() {
    return {
      onAdded: jasmine.createSpy('onAdded'),
      onRemoved: jasmine.createSpy('onRemoved'),
      setState: jasmine.createSpy('setState'),
      transform: jasmine.createSpy('transform')
    };
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

  it('#add()', inject(function($rootScope, $timeout) {
    var ctrl = makeCtrl();
    var slide1 = mockSlide();
    var slide2 = mockSlide();

    expect(ctrl.selected()).toBe(-1);
    ctrl.add(slide1);
    expect(ctrl.selected()).toBe(0);
    expect(ctrl.count()).toBe(1);
    $timeout.flush();
    expect(slide1.setState).toHaveBeenCalledWith('selected');

    ctrl.add(slide2);
    $rootScope.$apply();
    expect(ctrl.selected()).toBe(0);
    expect(ctrl.count()).toBe(2);
    $timeout.flush();
    expect(slide2.setState).toHaveBeenCalledWith('next');
  }));

  it('#remove()', function() {
    var ctrl = makeCtrl();
    var slide0, slide1, slide2;
    ctrl.add(slide0 = mockSlide());
    ctrl.add(slide1 = mockSlide());
    ctrl.add(slide2 = mockSlide());

    ctrl.select(1);
    expect(ctrl.selected()).toBe(1);

    ctrl.remove(slide1);
    expect(ctrl.selected()).toBe(1);
    expect(ctrl.at(1)).toBe(slide2);

    ctrl.remove(slide2);
    expect(ctrl.selected()).toBe(0);
  });

  it('#move()', function() {
    var ctrl = makeCtrl();
    var slide0, slide1;
    ctrl.add(slide0 = mockSlide());
    ctrl.add(slide1 = mockSlide());

    expect(ctrl.at(1)).toBe(slide1);
    ctrl.move(slide1, 0);
    expect(ctrl.at(0)).toBe(slide1);
    expect(ctrl.at(1)).toBe(slide0);
  });

  it('#onDrag()', function() {
    var ctrl = makeCtrl();
    var slide0, slide1, slide2;
    ctrl.add(slide0 = mockSlide());
    ctrl.add(slide1 = mockSlide());
    ctrl.add(slide2 = mockSlide());

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
    var slide0, slide1, slide2;
    ctrl.add(slide0 = mockSlide());
    ctrl.add(slide1 = mockSlide());
    ctrl.add(slide2 = mockSlide());

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
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());

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
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());

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
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());
    ctrl.add(mockSlide());

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
