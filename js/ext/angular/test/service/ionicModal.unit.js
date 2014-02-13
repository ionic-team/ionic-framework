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

    //timeout.flush();

    expect(modalInstance.el.classList.contains('active')).toBe(true);

    ionic.trigger('backbutton', {
      target: document
    });

    expect(modalInstance.el.classList.contains('active')).toBe(false);
  });

  it('should broadcast "modal.shown" on show', function() {
    var template = '<div class="modal"></div>';
    var m = modal.fromTemplate(template, {});
    spyOn(m.scope.$parent, '$broadcast');
    m.show();
    expect(m.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.shown', m);
  });
  it('should broadcast "modal.hidden" on hide', function() {
    var template = '<div class="modal"></div>';
    var m = modal.fromTemplate(template, {});
    spyOn(m.scope.$parent, '$broadcast');
    m.hide();
    expect(m.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.hidden', m);
  });
  it('should broadcast "modal.removed" on remove', inject(function($animate) {
    var template = '<div class="modal"></div>';
    var m = modal.fromTemplate(template, {});
    var broadcastedModal;
    var done = false;

    //By the time m.remove() is done, our scope will be destroyed. so we have to save the modal
    //it gives us
    spyOn(m.scope.$parent, '$broadcast').andCallFake(function(e, modal) {
      broadcastedModal = modal;
    });
    spyOn($animate, 'leave').andCallFake(function(el, cb) { cb(); });

    m.remove();
    expect(broadcastedModal).toBe(m);
  }));
});
