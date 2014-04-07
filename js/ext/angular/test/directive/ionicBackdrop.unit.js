describe('$ionicBackdrop service', function() {
  beforeEach(module('ionic'));

  beforeEach(function() {
    ionic.requestAnimationFrame = function(cb) { cb(); };
  });

  it('should create backdrop first time then reuse', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._getElement();
    var el2 = $ionicBackdrop._getElement();
    expect(el.hasClass('backdrop')).toBe(true);
    expect(el.hasClass('ng-hide')).toBe(true);
    expect(el[0]).toBe(el2[0]);
  }));

  it('should remove ngHide on retain', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._getElement();
    expect(el.hasClass('ng-hide')).toBe(true);
    $ionicBackdrop.retain();
    expect(el.hasClass('ng-hide')).toBe(false);
  }));

  it('should add ngHide on retain', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._getElement();
    expect(el.hasClass('ng-hide')).toBe(true);
    $ionicBackdrop.retain();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.release();
    expect(el.hasClass('ng-hide')).toBe(true);
  }));

  it('should require equal releases and retains', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._getElement();
    expect(el.hasClass('ng-hide')).toBe(true);
    $ionicBackdrop.retain();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.retain();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.retain();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.release();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.release();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.release();
    expect(el.hasClass('ng-hide')).toBe(true);
  }));
});
