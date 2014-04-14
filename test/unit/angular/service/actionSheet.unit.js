describe('Ionic ActionSheet Service', function() {
  var sheet, timeout, ionicPlatform;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicActionSheet, $timeout, $ionicPlatform) {
    sheet = $ionicActionSheet;
    timeout = $timeout;
    ionicPlatform = $ionicPlatform;
  }));

  it('Should show', function() {
    var s = sheet.show();
    expect(s.el.classList.contains('active')).toBe(true);
  });

  it('Should add .action-sheet-up to .action-sheet-wrapper', function() {
    var s = sheet.show();
    var el = angular.element(s.el);
    var wrapper = angular.element(s.el.querySelector('.action-sheet-wrapper'));
    expect(wrapper.length).toEqual(1);
    expect(wrapper.hasClass('action-sheet-up')).toEqual(false);
    timeout.flush();
    expect(wrapper.hasClass('action-sheet-up')).toEqual(true);
  });

  it('should handle hardware back button', function() {
    var s = sheet.show();

    ionicPlatform.hardwareBackButtonClick();

    expect(s.el.classList.contains('active')).toBe(false);
  });

  it('show & hide should add action-sheet-open to body', inject(function($animate) {
    var s = sheet.show();

    expect(angular.element(document.body).hasClass('action-sheet-open')).toBe(true);

    ionicPlatform.hardwareBackButtonClick();

    expect(angular.element(document.body).hasClass('action-sheet-open')).toBe(false);
  }));
});
