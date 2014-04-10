describe('$ionicBackdrop service', function() {
  beforeEach(module('ionic'));

  beforeEach(inject(function($animate) {
    ionic.requestAnimationFrame = function(cb) { cb(); };
  }));

  it('should remove ngHide on retain', inject(function($ionicBackdrop, $timeout) {
    var el = $ionicBackdrop._element;
    expect(el.hasClass('ng-hide')).toBe(true);
    $ionicBackdrop.retain();
    $timeout.flush();
    expect(el.hasClass('ng-hide')).toBe(false);
  }));

  it('should add ngHide on retain', inject(function($ionicBackdrop, $timeout) {
    var el = $ionicBackdrop._element;
    expect(el.hasClass('ng-hide')).toBe(true);
    $ionicBackdrop.retain();
    $timeout.flush();
    expect(el.hasClass('ng-hide')).toBe(false);
    $ionicBackdrop.release();
    $timeout.flush();
    expect(el.hasClass('ng-hide')).toBe(true);
  }));

  it('should require equal releases and retains', inject(function($ionicBackdrop, $timeout) {
    var el = $ionicBackdrop._element;
    expect(el.hasClass('ng-hide')).toBe(true);
    $ionicBackdrop.retain();
    $timeout.flush();
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
    $timeout.flush();
    expect(el.hasClass('ng-hide')).toBe(true);
  }));
});
