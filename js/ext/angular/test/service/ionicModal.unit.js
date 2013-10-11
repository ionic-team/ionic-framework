describe('Ionic Modal', function() {
  var modal, q;

  beforeEach(module('ionic.service.modal'));

  beforeEach(inject(function(Modal, $q, $templateCache) {
    q = $q;
    modal = Modal;

    $templateCache.put('modal.html', '<div class="modal"></div>');
  }));

  it('Should show for static template', function() {
    var template = '<div class="modal"></div>';
    var modalInstance = modal.fromTemplate(template);
    modalInstance.show();
    expect(modalInstance.el.classList.contains('modal')).toBe(true);
    expect(modalInstance.el.classList.contains('active')).toBe(true);
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

    waitsFor(function() {
      return done;
    }, "Modal should be loaded", 100);

  });
});
