describe('$ionicPopup service', function() {
  beforeEach(module('ionic'));
  var $ionicPopup;
  beforeEach(inject(function(_$ionicPopup_) {
    $ionicPopup = _$ionicPopup_;
    ionic.requestAnimationFrame = function(cb) { cb(); };
  }));

  describe('createPopup', function() {
    it('should make a popup element appended to body', function() {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
      expect(popup.element).toBeTruthy();
      expect(popup.element.hasClass('popup-container')).toBe(true);
      expect(popup.element.parent()[0]).toBe(document.body);
    });
    it('should default to $rootScope child as scope', inject(function($rootScope) {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
      expect(popup.scope.$parent).toBe($rootScope);
    }));
    it('should use child of passed in scope', inject(function($rootScope) {
      var scope = $rootScope.$new();
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({
        scope: scope
      }));
      expect(popup.scope.$parent).toBe(scope);
    }));
    it('should set .popup-body html to content option', function() {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({
        content: 'Hello, friend!'
      }));
      var popupBody = popup.element[0].querySelector('.popup-body');
      expect(popupBody.innerText).toBe('Hello, friend!');
    });
    it('should set .popup-body html to template option', function() {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({
        template: 'Hello, comrade!'
      }));
      var popupBody = popup.element[0].querySelector('.popup-body');
      expect(popupBody.innerText).toBe('Hello, comrade!');
    });
    it('should set .popup-body html to templateUrl option', inject(function($ionicTemplateLoader, $q) {
      spyOn($ionicTemplateLoader, 'load').andReturn($q.when('Hello, amigo!'));
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({
        templateUrl: 'hello.html'
      }));
      expect($ionicTemplateLoader.load).toHaveBeenCalledWith('hello.html');
      var popupBody = popup.element[0].querySelector('.popup-body');
      expect(popupBody.innerText).toBe('Hello, amigo!');
    }));
    it('should remove .popup-body if no content|template|templateUrl', function() {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
      var popupBody = popup.element[0].querySelector('.popup-body');
      expect(popupBody).toBe(null);
    });
    it('should set the specified custom CSS class to popup container', function() {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({
        template: 'Hello, friend!',
        cssClass: 'mycustomclass'
      }));
      expect(popup.element.hasClass('mycustomclass')).toBe(true);
    });

    describe('$buttonTapped', function() {
      var popup;
      beforeEach(function() {
        popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        spyOn(popup.responseDeferred, 'resolve');
      });
      it('should call button.onTap with event', function() {
        var button = { onTap: jasmine.createSpy('onTap') };
        var event = {};
        popup.scope.$buttonTapped(button, event);
        expect(button.onTap).toHaveBeenCalledWith(event);
      });
      it('should resolve with return value from button.onTap', function() {
        popup.scope.$buttonTapped({
          onTap: function() { return '123'; }
        }, {});
        expect(popup.responseDeferred.resolve).toHaveBeenCalledWith('123');
      });
      it('should not resolve if defaultPrevented', function() {
        popup.scope.$buttonTapped({
          onTap: function(){}
        }, {
          defaultPrevented: true
        });
        expect(popup.responseDeferred.resolve).not.toHaveBeenCalled();
      });
    });

    describe('show', function() {
      it('should add classes', function() {
        var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        popup.element.addClass('popup-hidden');
        popup.show();
        expect(popup.element.hasClass('popup-hidden')).toBe(false);
        expect(popup.element.hasClass('popup-showing active')).toBe(true);
      });
      it('should set isShown to true', function() {
        var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        expect(popup.isShown).toBeFalsy();
        popup.show();
        expect(popup.isShown).toBe(true);
      });
      it('should not show if isShown=false during raf wait', function() {
        var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        var rafCallback;
        ionic.requestAnimationFrame = function(cb) { rafCallback = cb; };
        expect(popup.isShown).toBeFalsy();
        popup.show();
        expect(popup.isShown).toBe(true);
        popup.isShown = false;
        rafCallback();
        expect(popup.element.hasClass('popup-showing')).toBe(false);
        expect(popup.element.hasClass('active')).toBe(false);
        ionic.requestAnimationFrame = function(cb) { cb(); };
      });
      // Test broken in PhantomJS because it uses element.offsetHeight
      // it('should shrink .popup-body height so that the popup is never taller than the window', function() {
      //   str = 'All work and no play... ';
      //   for(var i=0; i<13;i++){
      //     str = str + str;
      //   }
      //   var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({
      //     template: str
      //   }));
      //   popup.show();
      //   var windowIsLarger = popup.element[0].offsetHeight < window.innerHeight;
      //   expect(windowIsLarger).toBe(true);
      // });
    });

    describe('hide', function() {
      it('should remove active, add popup-hidden, and call callback', inject(function($timeout) {
        var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        popup.element.addClass('active');
        popup.isShown = true;
        var spy = jasmine.createSpy('callback');
        popup.hide(spy);
        expect(popup.element.hasClass('active')).toBe(false);
        expect(popup.element.hasClass('popup-hidden')).toBe(true);
        expect(spy).not.toHaveBeenCalled();
        $timeout.flush();
        expect(spy).toHaveBeenCalled();
      }));
      it('should keep class if isShown isnt true', inject(function($ionicBackdrop) {
        var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        popup.element.addClass('active');
        popup.isShown = false;
        popup.hide();
        expect(popup.element.hasClass('active')).toBe(true);
      }));
    });

    describe('remove', function() {
      it('should hide and then remove the element and destroy the scope', function() {
        var popup = TestUtil.unwrapPromise($ionicPopup._createPopup());
        spyOn(popup, 'hide').andCallFake(function(cb) {
          cb();
        });
        popup.show();
        spyOn(popup.element, 'remove');
        spyOn(popup.scope, '$destroy');
        popup.remove();
        expect(popup.hide).toHaveBeenCalled();
        expect(popup.element.remove).toHaveBeenCalled();
        expect(popup.scope.$destroy).toHaveBeenCalled();
      });
    });

  });

  describe('$ionicPopup.showPopup()', function() {
    afterEach(function() {
      document.body.classList.remove('popup-open');
    });

    it('should add popup-open and retain backdrop and register back button action if no previous popup', inject(function($ionicBackdrop, $timeout, $ionicPlatform, IONIC_BACK_PRIORITY) {
      spyOn($ionicPlatform, 'registerBackButtonAction').andReturn('actionReturn');
      spyOn($ionicBackdrop, 'retain');
      $ionicPopup.show();
      $timeout.flush();
      expect(angular.element(document.body).hasClass('popup-open')).toBe(true);
      expect($ionicBackdrop.retain).toHaveBeenCalled();
      expect($ionicPlatform.registerBackButtonAction).toHaveBeenCalledWith(
        jasmine.any(Function),
        IONIC_BACK_PRIORITY.popup
      );
      expect($ionicPopup._backButtonActionDone).toBe('actionReturn');
    }));

    it('should hide previous popup if exists and not popup-open & backdrop', inject(function($ionicBackdrop, $timeout) {
      var previousPopup = { hide: jasmine.createSpy('hide') };
      spyOn($ionicBackdrop, 'retain');
      $ionicPopup._popupStack.unshift(previousPopup);
      $ionicPopup.show();
      $timeout.flush();
      expect(previousPopup.hide).toHaveBeenCalled();
      expect(angular.element(document.body).hasClass('popup-open')).toBe(false);
      expect($ionicBackdrop.retain).not.toHaveBeenCalled();
    }));

    it('should after timeout add popup to popupstack and show it', inject(function($ionicPopup, $timeout, $q) {
      var fakePopup = {
        show: jasmine.createSpy('show'),
        responseDeferred: $q.defer()
      };
      spyOn($ionicPopup, '_createPopup').andReturn(fakePopup);
      expect($ionicPopup._popupStack.length).toBe(0);
      $ionicPopup.show();
      expect(fakePopup.show).not.toHaveBeenCalled();
      $timeout.flush();
      expect($ionicPopup._popupStack.length).toBe(1);
      expect($ionicPopup._popupStack[0]).toBe(fakePopup);
      expect(fakePopup.show).toHaveBeenCalled();
    }));

    it('should have close function which resolves promise with argument', inject(function($ionicPopup, $q, $rootScope) {
      var popup = TestUtil.unwrapPromise($ionicPopup._createPopup({template: 'foo'}));
      spyOn($ionicPopup, '_createPopup').andReturn(popup);
     var result = $ionicPopup.show();
      spyOn(popup.responseDeferred, 'resolve');
      result.close('foobar');
      $rootScope.$apply();
      expect(popup.responseDeferred.resolve).toHaveBeenCalledWith('foobar');
    }));

    it('should after timeout and resolve remove popup, then return result', inject(function($ionicPopup, $timeout, $q, $rootScope) {
      var fakePopup = {
        show: jasmine.createSpy('show'),
        remove: jasmine.createSpy('remove'),
        responseDeferred: $q.defer()
      };
      spyOn($ionicPopup, '_createPopup').andReturn(fakePopup);
      var result = $ionicPopup.show();
      $timeout.flush();
      expect(fakePopup.remove).not.toHaveBeenCalled();
      fakePopup.responseDeferred.resolve('popup result!');
      $rootScope.$apply();
      expect(fakePopup.remove).toHaveBeenCalled();
      expect($ionicPopup._popupStack.length).toBe(0);
      expect(TestUtil.unwrapPromise(result)).toBe('popup result!');
    }));

    it('should show previous popup on resolve if exists', inject(function($q, $timeout) {
      var fakePopup = {
        show: jasmine.createSpy('show'),
        remove: jasmine.createSpy('remove'),
        responseDeferred: $q.defer()
      };
      var previousPopup = {
        show: jasmine.createSpy('show'),
        hide: jasmine.createSpy('hide')
      };
      spyOn($ionicPopup, '_createPopup').andReturn(fakePopup);
      $ionicPopup._popupStack.unshift(previousPopup);
      $ionicPopup.show();
      fakePopup.responseDeferred.resolve();
      $timeout.flush();
      expect(previousPopup.show).toHaveBeenCalled();
    }));

    it('should release backdrop and remove popup-open and deregister back if no previous', inject(function($q, $timeout, $ionicBackdrop, $ionicPlatform) {
      var fakePopup = {
        show: jasmine.createSpy('show'),
        remove: jasmine.createSpy('remove'),
        responseDeferred: $q.defer()
      };
      var backDoneSpy = jasmine.createSpy('backDone');
      spyOn($ionicPlatform, 'registerBackButtonAction').andReturn(backDoneSpy);
      spyOn($ionicBackdrop, 'release');
      spyOn($ionicPopup, '_createPopup').andReturn(fakePopup);
      $ionicPopup.show();
      fakePopup.responseDeferred.resolve();
      $timeout.flush();
      expect(backDoneSpy).toHaveBeenCalled();
      $timeout.flush();
      expect($ionicBackdrop.release).toHaveBeenCalled();
      expect(document.body.classList.contains('popup-open')).toBe(false);
    }));
    it('template should only overwrite prompt input if it includes html', inject(function($timeout, $q) {
      spyOn($ionicPopup, '_createPopup').andCallThrough();
      $ionicPopup.prompt({template: "Tacos!"});
      params = $ionicPopup._createPopup.mostRecentCall.args;
      expect(params[0].template.indexOf('<span>Tacos!</span>')).toEqual(0);
      expect(params[0].template.indexOf('<input')).toBeGreaterThan(6);

      $ionicPopup.prompt({template: '<input type="email" />'});
      params = $ionicPopup._createPopup.mostRecentCall.args;
      expect(params[0].template.indexOf('<input type="email" />')).toEqual(0);
    }));
  });
});
