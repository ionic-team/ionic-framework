describe('Ionic Modal', function() {
  var modal, q, timeout;

  beforeEach(module('ionic.service.modal'));

  beforeEach(inject(function($ionicModal, $q, $templateCache, $timeout) {
    q = $q;
    modal = $ionicModal;
    timeout = $timeout;

    $templateCache.put('modal.html', '<div class="modal"></div>');
  }));

  it('Should show for static template', function() {
    var template = '<div class="modal"></div>';
    var modalInstance = modal.fromTemplate(template);
    modalInstance.show();
    expect(modalInstance.el.classList.contains('modal')).toBe(true);
    expect(modalInstance.el.classList.contains('slide-in-up')).toBe(true);
  });

  it('Should show for dynamic template', function() {
    var template = '<div class="modal"></div>';

    var done = false;

    var modalInstance = modal.fromTemplateUrl('modal.html', function(modalInstance) {
      done = true;
      modalInstance.show();
      expect(modalInstance.el.classList.contains('modal')).toBe(true);
      expect(modalInstance.el.classList.contains('active')).toBe(true);
    });

    timeout.flush();

    waitsFor(function() {
      return done;
    }, "Modal should be loaded", 100);

  });

  it('Should close on hardware back button', function() {
    var template = '<div class="modal"></div>';
    var modalInstance = modal.fromTemplate(template);
    modalInstance.show();

    timeout.flush();

    expect(modalInstance.el.classList.contains('active')).toBe(true);

    ionic.trigger('backbutton', {
      target: document
    });

    expect(modalInstance.el.classList.contains('active')).toBe(false);
  });
});
