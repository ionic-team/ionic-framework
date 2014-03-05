describe('Ionic ActionSheet Service', function() {
  var sheet, timeout;

  beforeEach(module('ionic.service.actionSheet'));

  beforeEach(inject(function($ionicActionSheet, $timeout) {
    sheet = $ionicActionSheet;
    timeout = $timeout;
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

  it('Should handle hardware back button', function() {
    // Fake cordova
    window.device = {};
    ionic.Platform.isReady = true;
    var s = sheet.show();

    ionic.trigger('backbutton', {
      target: document
    });

    expect(s.el.classList.contains('active')).toBe(false);
  });

  it('show & hide should add action-sheet-open to body', inject(function($animate) {
    var s = sheet.show();

    expect(angular.element(document.body).hasClass('action-sheet-open')).toBe(true);

    ionic.trigger('backbutton', {
      target: document
    });

    expect(angular.element(document.body).hasClass('action-sheet-open')).toBe(false);
  }));
});
