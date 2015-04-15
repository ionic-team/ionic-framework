describe('Ionic Popover', function() {
  var popover, q, timeout, ionicPlatform, rootScope;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicPopover, $q, $templateCache, $timeout, $ionicPlatform, $rootScope) {
    q = $q;
    popover = $ionicPopover;
    timeout = $timeout;
    ionicPlatform = $ionicPlatform;
    rootScope = $rootScope;

    $templateCache.put('popover.html', '<div class="popover"></div>');
  }));

  it('Should set popover instance properties', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    expect(instance.viewType).toEqual('popover');
    expect(instance.hideDelay).toEqual(1);
    expect(instance.animation).toEqual('none');
  });

  it('Should show for static template', function() {
    var template = '<ion-popover-view></ion-popover-view>';
    var instance = popover.fromTemplate(template);
    var target = document.createElement('button');
    instance.show(target);
    expect(instance.el.classList.contains('popover-backdrop')).toBe(true);
    expect(instance.modalEl.classList.contains('popover')).toBe(true);
    expect(instance.modalEl.querySelector('.popover-arrow')).toBeDefined();
  });

  it('Should show for dynamic template', function() {
    var template = '<div class="popover"></div>';

    var done = false;

    popover.fromTemplateUrl('popover.html').then(function(instance) {
      done = true;
      instance.show();
      expect(instance.el.classList.contains('popover-backdrop')).toBe(true);
      expect(instance.modalEl.classList.contains('popover')).toBe(true);
      expect(instance.modalEl.classList.contains('active')).toBe(true);
    });

    timeout.flush();
    expect(done).toBe(true);
  });

  it('should set isShown on show/hide', function() {
    var instance = popover.fromTemplate('<div class="popover">hello</div>');
    expect(instance.isShown()).toBe(false);
    instance.show();
    expect(instance.isShown()).toBe(true);
    instance.hide();
    expect(instance.isShown()).toBe(false);
  });

  it('should trigger a resize event', function() {
    var instance = popover.fromTemplate('<div class="popover">hello</div>');
    spyOn(ionic, 'trigger');
    instance.show();
    timeout.flush();
    expect(ionic.trigger).toHaveBeenCalledWith('resize');
  });

  it('should set isShown on remove', function() {
    var instance = popover.fromTemplate('<div class="popover">hello</div>');
    expect(instance.isShown()).toBe(false);
    instance.show();
    expect(instance.isShown()).toBe(true);
    instance.remove();
    expect(instance.isShown()).toBe(false);
  });

  it('show & remove should add .popover-open to body', inject(function() {
    var instance = popover.fromTemplate('<div class="popover">hi</div>');
    instance.show();
    timeout.flush();
    expect(angular.element(document.body).hasClass('popover-open')).toBe(true);
    instance.remove();
    timeout.flush();
    expect(angular.element(document.body).hasClass('popover-open')).toBe(false);
  }));

  it('show & hide should add .model-open body', inject(function() {
    var instance = popover.fromTemplate('<div class="popover">hi</div>');
    instance.show();
    timeout.flush();
    expect(angular.element(document.body).hasClass('popover-open')).toBe(true);
    instance.hide();
    timeout.flush();
    expect(angular.element(document.body).hasClass('popover-open')).toBe(false);
  }));

  it('expect hide to remove event listeners', inject(function($window) {
    var instance = popover.fromTemplate('<div class="popover">hi</div>');
    instance.show();
    timeout.flush();
    spyOn(ionic,'off');
    instance.hide();
    expect(ionic.off).toHaveBeenCalled();
  }));

  it('should animate leave and destroy scope on remove', inject(function($animate) {
    var instance = popover.fromTemplate('<div class="popover"></div>');
    spyOn($animate, 'leave').andCallFake(function(el, cb) { cb(); });
    spyOn(instance.scope, '$destroy');
    instance.remove();
    timeout.flush();
    expect(instance.scope.$destroy).toHaveBeenCalled();
  }));

  it('Should close on hardware back button by default', inject(function($ionicPlatform) {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    spyOn($ionicPlatform, 'registerBackButtonAction').andCallThrough();
    instance.show();

    timeout.flush();
    expect(instance.isShown()).toBe(true);
    expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalled();

    ionicPlatform.hardwareBackButtonClick();

    expect(instance.isShown()).toBe(false);
  }));

  it('should not close on hardware back button if option', inject(function($ionicPlatform, IONIC_BACK_PRIORITY) {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {
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
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    instance.show();
    timeout.flush();
    spyOn(instance, '_deregisterBackButton');
    instance.hide();
    expect(instance._deregisterBackButton).toHaveBeenCalled();
  });

  it('should close popover on backdrop click after animate is done', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    spyOn(instance, 'hide');
    instance.show();
    timeout.flush();
    instance.$el.triggerHandler('click');
    expect(instance.hide).toHaveBeenCalled();
  });

  it('should not close popover on backdrop click if options.backdropClickToClose', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, { backdropClickToClose: false });
    spyOn(instance, 'hide');
    instance.show();
    timeout.flush();
    instance.$el.triggerHandler('click');
    expect(instance.hide).not.toHaveBeenCalled();
  });

  it('should not close popover on backdrop click if target is not backdrop', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    spyOn(instance, 'hide');
    instance.show();
    timeout.flush();
    ionic.trigger('click', { target: instance.el.firstElementChild }, true);
    expect(instance.hide).not.toHaveBeenCalled();
  });

  it('should not close popover on backdrop click until animation is done', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    spyOn(instance, 'hide');
    instance.show();
    instance.$el.triggerHandler('click');
    expect(instance.hide).not.toHaveBeenCalled();
    timeout.flush();
    instance.$el.triggerHandler('click');
    expect(instance.hide).toHaveBeenCalled();
  });

  it('should remove click listener on hide', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template);
    spyOn(instance.$el, 'off');
    instance.hide();
    expect(instance.$el.off).toHaveBeenCalledWith('click');
  });

  it('should broadcast "popover.shown" on show with self', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {});
    spyOn(instance.scope.$parent, '$broadcast').andCallThrough();
    instance.show();
    timeout.flush();
    expect(instance.scope.$parent.$broadcast).toHaveBeenCalledWith('popover.shown', instance);
  });

  it('should set custom options', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {
      animation: 'custom-animation'
    });
    instance.show();
    timeout.flush();
    expect(instance.$el[0].querySelector('.popover').classList.contains('custom-animation')).toBe(true);
  });

  it('should broadcast "popover.hidden" on hide with self', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {});
    spyOn(instance.scope.$parent, '$broadcast');
    instance.hide();
    expect(instance.scope.$parent.$broadcast).toHaveBeenCalledWith('popover.hidden', instance);
  });

  it('should broadcast "popover.removed" on remove', inject(function($animate) {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {});
    var broadcastedModal;
    var done = false;

    //By the time instance.remove() is done, our scope will be destroyed. so we have to save the popover
    //it gives us
    spyOn(instance.scope.$parent, '$broadcast').andCallThrough();
    spyOn(instance.scope, '$destroy');

    instance.remove();
    expect(instance.scope.$parent.$broadcast).toHaveBeenCalledWith('popover.removed', instance);
    timeout.flush();
  }));

  it('show should return a promise resolved on hide', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {});
    var done = false;

    instance.hide().then(function() {
      done = true;
    });
    expect(instance.el.classList.contains('hide')).toBe(false);
    timeout.flush();
    expect(instance.el.classList.contains('hide')).toBe(true);
    expect(done).toBe(true);
  });

  it('show should return a promise resolved on remove', function() {
    var template = '<div class="popover"></div>';
    var instance = popover.fromTemplate(template, {});
    var done = false;

    instance.remove().then(function() {
      done = true;
    });
    spyOn(instance.scope, '$destroy');
    timeout.flush();
    expect(instance.scope.$destroy).toHaveBeenCalled();
    expect(done).toBe(true);
  });

});
