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
    expect(done).toBe(true);
  });

  it('should set isShown on show/hide', function() {
    var m = modal.fromTemplate('<div class="modal">hello</div>');
    expect(m.isShown()).toBe(false);
    m.show();
    expect(m.isShown()).toBe(true);
    m.hide();
    expect(m.isShown()).toBe(false);
  });

  it('should set isShown on remove', function() {
    var m = modal.fromTemplate('<div class="modal">hello</div>');
    expect(m.isShown()).toBe(false);
    m.show();
    expect(m.isShown()).toBe(true);
    m.remove();
    expect(m.isShown()).toBe(false);
  });

  it('show & remove should add {disable,enable}-pointer-events to body/modal', inject(function($animate) {
    var m = modal.fromTemplate('<div class="modal">hi</div>');
    m.show();
    expect(angular.element(m.el).hasClass('enable-pointer-events')).toBe(true);
    expect(angular.element(document.body).hasClass('disable-pointer-events')).toBe(true);
    spyOn($animate, 'leave').andCallFake(function(el, cb) {
      cb();
    });
    m.remove();
    expect(angular.element(m.el).hasClass('enable-pointer-events')).toBe(false);
    expect(angular.element(document.body).hasClass('disable-pointer-events')).toBe(false);
  }));

  it('show & hide should add {disable,enable}-pointer-events to body/modal', inject(function($animate) {
    var m = modal.fromTemplate('<div class="modal">hi</div>');
    m.show();
    expect(angular.element(m.el).hasClass('enable-pointer-events')).toBe(true);
    expect(angular.element(document.body).hasClass('disable-pointer-events')).toBe(true);
    spyOn($animate, 'removeClass').andCallFake(function(el, cls, cb) {
      cb();
    });
    m.hide();
    expect(angular.element(m.el).hasClass('enable-pointer-events')).toBe(false);
    expect(angular.element(document.body).hasClass('disable-pointer-events')).toBe(false);
  }));

  it('should animate leave and destroy scope on remove', inject(function($animate) {
    var m = modal.fromTemplate('<div class="modal"></div>');
    spyOn($animate, 'leave').andCallFake(function(el, cb) { cb(); });
    spyOn(m.scope, '$destroy');
    m.remove();
    expect($animate.leave).toHaveBeenCalled();
    expect(m.scope.$destroy).toHaveBeenCalled();
  }));

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
