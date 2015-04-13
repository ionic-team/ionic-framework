describe('$ionicBackdrop service', function() {
  beforeEach(module('ionic', function($provide) {
    $provide.value('$$rAF', function(cb) { cb(); });
  }));

  it('should add active on retain', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._element;
    expect(el.hasClass('active')).toBe(false);
    $ionicBackdrop.retain();
    expect(el.hasClass('active')).toBe(true);
  }));

  it('should add and remove active on retain and release', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._element;
    expect(el.hasClass('active')).toBe(false);
    $ionicBackdrop.retain();
    expect(el.hasClass('active')).toBe(true);
    $ionicBackdrop.release();
    expect(el.hasClass('active')).toBe(false);
  }));

  it('should require equal releases and retains', inject(function($ionicBackdrop) {
    var el = $ionicBackdrop._element;
    expect(el.hasClass('active')).toBe(false);
    $ionicBackdrop.retain();
    expect(el.hasClass('active')).toBe(true);
    $ionicBackdrop.retain();
    expect(el.hasClass('active')).toBe(true);
    $ionicBackdrop.retain();
    expect(el.hasClass('active')).toBe(true);
    $ionicBackdrop.release();
    expect(el.hasClass('active')).toBe(true);
    $ionicBackdrop.release();
    expect(el.hasClass('active')).toBe(true);
    $ionicBackdrop.release();
    expect(el.hasClass('active')).toBe(false);
  }));
});
