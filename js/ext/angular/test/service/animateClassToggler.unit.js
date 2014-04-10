describe('$animateClassToggler service', function() {
  beforeEach(module('ionic'));

  var toggler, el;
  beforeEach(inject(function($animateClassToggler) {
    el = angular.element('<div>');
    toggler = $animateClassToggler(el, 'foo');
    ionic.requestAnimationFrame = function(cb) { cb(); };
  }));

  function flush() {
    inject(function($timeout) {
      $timeout.flush();
    });
  }

  it('addClass should go to toggle', function() {
    spyOn(toggler, '_toggle');
    toggler.addClass();
    expect(toggler._toggle).toHaveBeenCalledWith(true);
  });
  it('removeClass should go to toggle', function() {
    spyOn(toggler, '_toggle');
    toggler.removeClass();
    expect(toggler._toggle).toHaveBeenCalledWith(false);
  });
  it('toggle should add class and remove class', function() {
    toggler._toggle(true);
    flush();
    expect(el.hasClass('foo')).toBe(true);
    toggler._toggle(false);
    flush();
    expect(el.hasClass('foo')).toBe(false);
  });

  it('toggle should set nextOperation if animating', function() {
    toggler._animating = true;
    toggler._toggle(true);
    expect(toggler._nextOperation).toBe('addClass');
    toggler._toggle(false);
    expect(toggler._nextOperation).toBe('removeClass');
  });

  it('animate should set animating to true and animationDone when done', inject(function($rootScope, $animate) {
    spyOn($rootScope, '$evalAsync').andCallThrough();
    spyOn($animate, 'addClass');
    toggler._animate('addClass');
    expect(toggler._animating).toBe(true);
    expect($rootScope.$evalAsync).toHaveBeenCalled();
    flush();
    expect($animate.addClass).toHaveBeenCalledWith(el, 'foo', toggler._animationDone);
  }));

  it('animationDone should use nextOperation and unset animating if no more', function() {
    spyOn(toggler, '_animate').andCallThrough();
    toggler._animating = true;
    toggler._nextOperation = 'addClass';
    toggler._animationDone();
    expect(toggler._nextOperation).toBeFalsy();
    expect(toggler._animate).toHaveBeenCalled();
    flush();
    expect(el.hasClass('foo')).toBe(true);
    expect(toggler._animating).toBe(false);
  });

});
