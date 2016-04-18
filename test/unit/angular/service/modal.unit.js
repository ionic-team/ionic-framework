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
    var instance = modal.fromTemplate(template);
    instance.show();
    expect(instance.el.classList.contains('modal-backdrop')).toBe(true);
    expect(instance.modalEl.classList.contains('modal')).toBe(true);
    expect(instance.modalEl.classList.contains('slide-in-up')).toBe(true);
  });

  it('Should show for dynamic template', function() {
    var template = '<div class="modal"></div>';

    var done = false;

    var instance = modal.fromTemplateUrl('modal.html', function(instance) {
      done = true;
      instance.show();
      expect(instance.el.classList.contains('modal-backdrop')).toBe(true);
      expect(instance.modalEl.classList.contains('modal')).toBe(true);
      expect(instance.modalEl.classList.contains('active')).toBe(true);
    });

    timeout.flush();
    expect(done).toBe(true);
  });

  it('should set isShown on show/hide', function() {
    var instance = modal.fromTemplate('<div class="modal">hello</div>');
    expect(instance.isShown()).toBe(false);
    instance.show();
    expect(instance.isShown()).toBe(true);
    instance.hide();
    expect(instance.isShown()).toBe(false);
  });

  it('should trigger a resize event', function() {
    var instance = modal.fromTemplate('<div class="modal">hello</div>');
    spyOn(ionic, 'trigger');
    instance.show();
    timeout.flush();
    expect(ionic.trigger).toHaveBeenCalledWith('resize');
  });

  it('should set isShown on remove', function() {
    var instance = modal.fromTemplate('<div class="modal">hello</div>');
    expect(instance.isShown()).toBe(false);
    instance.show();
    expect(instance.isShown()).toBe(true);
    instance.remove();
    expect(instance.isShown()).toBe(false);
  });

  it('show & remove should add .model-open to body', inject(function() {
    var instance = modal.fromTemplate('<div class="modal">hi</div>');
    instance.show();
    timeout.flush();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(true);
    instance.remove();
    timeout.flush();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(false);
  }));

  it('show & hide should add .model-open body', inject(function() {
    var instance = modal.fromTemplate('<div class="modal">hi</div>');
    instance.show();
    timeout.flush();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(true);
    instance.hide();
    timeout.flush();
    expect(angular.element(document.body).hasClass('modal-open')).toBe(false);
  }));

  it('should animate leave and destroy scope on remove', inject(function($animate) {
    var instance = modal.fromTemplate('<div class="modal"></div>');
    spyOn($animate, 'leave').andCallFake(function(el, cb) { cb(); });
    spyOn(instance.scope, '$destroy');
    instance.remove();
    timeout.flush();
    expect(instance.scope.$destroy).toHaveBeenCalled();
  }));

  it('Should close on hardware back button by default', inject(function($ionicPlatform) {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template);
    spyOn($ionicPlatform, 'registerBackButtonAction').andCallThrough();
    instance.show();

    timeout.flush();
    expect(instance.isShown()).toBe(true);
    expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalled();

    ionicPlatform.hardwareBackButtonClick();

    expect(instance.isShown()).toBe(false);
  }));

  it('should not close on hardware back button if option', inject(function($ionicPlatform, IONIC_BACK_PRIORITY) {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {
      hardwareBackButtonClose: false
    });
    spyOn($ionicPlatform, 'registerBackButtonAction').andCallThrough();
    instance.show();
    timeout.flush();
    expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalledWith(
      jasmine.any(Function),
      IONIC_BACK_PRIORITY.modal
    );

    ionicPlatform.hardwareBackButtonClick();

    expect(instance.isShown()).toBe(true);
  }));

  it('should call _deregisterBackButton on hide', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template);
    instance.show();
    timeout.flush();
    spyOn(instance, '_deregisterBackButton');
    instance.hide();
    expect(instance._deregisterBackButton).toHaveBeenCalled();
  });

  it('should close modal on backdrop click after animate is done', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template);
    spyOn(instance, 'hide');
    instance.show();
    timeout.flush();
    instance.$el.triggerHandler('click');
    expect(instance.hide).toHaveBeenCalled();
  });

  it('should not close modal on backdrop click if options.backdropClickToClose', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, { backdropClickToClose: false });
    spyOn(instance, 'hide');
    instance.show();
    timeout.flush();
    instance.$el.triggerHandler('click');
    expect(instance.hide).not.toHaveBeenCalled();
  });

  it('should not close modal on backdrop click if target is not backdrop', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template);
    spyOn(instance, 'hide');
    instance.show();
    timeout.flush();
    ionic.trigger('click', { target: instance.el.firstElementChild }, true);
    expect(instance.hide).not.toHaveBeenCalled();
  });

  it('should not close modal on backdrop click until animation is done', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template);
    spyOn(instance, 'hide');
    instance.show();
    instance.$el.triggerHandler('click');
    expect(instance.hide).not.toHaveBeenCalled();
    timeout.flush();
    instance.$el.triggerHandler('click');
    expect(instance.hide).toHaveBeenCalled();
  });

  it('should remove click listener on hide', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template);
    spyOn(instance.$el, 'off');
    instance.hide();
    expect(instance.$el.off).toHaveBeenCalledWith('click');
  });

  it('should broadcast "modal.shown" on show with self', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {});
    spyOn(instance.scope.$parent, '$broadcast').andCallThrough();
    instance.show();
    timeout.flush();
    expect(instance.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.shown', instance);
  });

  it('should broadcast "modal.hidden" on hide with self', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {});
    spyOn(instance.scope.$parent, '$broadcast');
    instance.hide();
    expect(instance.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.hidden', instance);
  });

  it('should broadcast "modal.removed" on remove', inject(function($animate) {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {});
    var broadcastedModal;
    var done = false;

    //By the time instance.remove() is done, our scope will be destroyed. so we have to save the modal
    //it gives us
    spyOn(instance.scope.$parent, '$broadcast').andCallThrough();
    spyOn(instance.scope, '$destroy');

    instance.remove();
    expect(instance.scope.$parent.$broadcast).toHaveBeenCalledWith('modal.removed', instance);
    timeout.flush();
  }));

  it('show should return a promise resolved on hide', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {});
    var done = false;

    instance.hide().then(function() {
      done = true;
    });
    expect(instance.el.classList.contains('hide')).toBe(false);
    timeout.flush();
    expect(instance.el.classList.contains('hide')).toBe(true);
    expect(done).toBe(true);
  });

  it('hide should be called when removing a modal that is presently displayed', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {});
    instance._isShown = true;
    var done = false;

    spyOn(instance, "hide").andCallThrough();

    instance.remove().then(function() {
      done = true;
    });
    spyOn(instance.scope, '$destroy');
    timeout.flush();
    expect(instance.scope.$destroy).toHaveBeenCalled();
    expect(done).toBe(true);
    expect(instance.hide).toHaveBeenCalled();
  });

  it('hide should not be called when removing a modal that is not displayed', function() {
    var template = '<div class="modal"></div>';
    var instance = modal.fromTemplate(template, {});
    instance._isShown = false;
    var done = false;

    spyOn(instance, "hide").andCallThrough();

    instance.remove().then(function() {
      done = true;
    });
    spyOn(instance.scope, '$destroy');
    timeout.flush();
    expect(instance.scope.$destroy).toHaveBeenCalled();
    expect(done).toBe(true);
    expect(instance.hide).not.toHaveBeenCalled();
  });

});
