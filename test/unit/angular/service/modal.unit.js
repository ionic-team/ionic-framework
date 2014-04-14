describe('Ionic Modal', function() {
  var modal, q, timeout, ionicPlatform, rootScope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicModal, $q, $templateCache, $timeout, $ionicPlatform, $rootScope) {
    q = $q;
    modal = $ionicModal;
    timeout = $timeout;
    ionicPlatform = $ionicPlatform;
    rootScope = $rootScope;

    $templateCache.put('modal.html', '<div class="modal"></div>');
  }));

  it('Should show for static template', function() {
    var template = '<div class="modal"></div>';
    var modalInstance = modal.fromTemplate(template);
    modalInstance.show();
    expect(modalInstance.el.classList.contains('modal-backdrop')).toBe(true);
    expect(modalInstance.modalEl.classList.contains('modal')).toBe(true);
    expect(modalInstance.modalEl.classList.contains('slide-in-up')).toBe(true);
  });

  it('Should show for dynamic template', function() {
    var template = '<div class="modal"></div>';

    var done = false;

    var modalInstance = modal.fromTemplateUrl('modal.html', function(modalInstance) {
      done = true;
      modalInstance.show();
      expect(modalInstance.el.classList.contains('modal-backdrop')).toBe(true);
      expect(modalInstance.modalEl.classList.contains('modal')).toBe(true);
      expect(modalInstance.modalEl.classList.contains('active')).toBe(true);
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

  it('show & remove should add .model-open to body', inject(function() {
    var m = modal.fromTemplate('<div class="modal">hi</div>');
    m.show();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(true);
    m.remove();
    timeout.flush();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(false);
  }));

  it('show & hide should add .model-open body', inject(function() {
    var m = modal.fromTemplate('<div class="modal">hi</div>');
    m.show();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(true);
    m.hide();
    timeout.flush();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(false);
  }));

  it('should animate leave and destroy scope on remove', inject(function($animate) {
    var m = modal.fromTemplate('<div class="modal"></div>');
    spyOn($animate, 'leave').andCallFake(function(el, cb) { cb(); });
    spyOn(m.scope, '$destroy');
    m.remove();
    timeout.flush();
    expect(m.scope.$destroy).toHaveBeenCalled();
  }));

  it('Should close on hardware back button', inject(function($ionicPlatform) {
    var template = '<div class="modal"></div>';
    var modalInstance = modal.fromTemplate(template);
    spyOn($ionicPlatform, 'registerBackButtonAction').andCallThrough();
    modalInstance.show();

    timeout.flush();
    expect(modalInstance.isShown()).toBe(true);
    expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalled();

    ionicPlatform.hardwareBackButtonClick();

    expect(modalInstance.isShown()).toBe(false);
  }));

  it('should broadcast "modal.shown" on show with self', function() {
    var template = '<div class="modal"></div>';
    var m = modal.fromTemplate(template, {});
    spyOn(m.scope.$parent, '$broadcast').andCallThrough();
    m.show();
    timeout.flush();
    expect(m.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.shown', m);
  });

  it('should broadcast "modal.hidden" on hide with self', function() {
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
    spyOn(m.scope.$parent, '$broadcast').andCallThrough();
    spyOn(m.scope, '$destroy');

    m.remove();
    expect(m.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.removed', m);
    timeout.flush();
  }));

  it('show should return a promise resolved on hide', function() {
    var template = '<div class="modal"></div>';
    var m = modal.fromTemplate(template, {});
    var done = false;

    m.hide().then(function() {
      done = true;
    });
    expect(m.el.classList.contains('hide')).toBe(false);
    timeout.flush();
    expect(m.el.classList.contains('hide')).toBe(true);
    expect(done).toBe(true);
  });

  it('show should return a promise resolved on remove', function() {
    var template = '<div class="modal"></div>';
    var m = modal.fromTemplate(template, {});
    var done = false;

    m.remove().then(function() {
      done = true;
    });
    spyOn(m.scope, '$destroy');
    timeout.flush();
    expect(m.scope.$destroy).toHaveBeenCalled();
    expect(done).toBe(true);
  });

});
