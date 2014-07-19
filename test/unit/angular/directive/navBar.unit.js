describe('ionNavBar', function() {
  describe('$ionicNavBar controller', function() {

    var backView = { go: jasmine.createSpy('backViewGo') };
    beforeEach(module('ionic', function($provide) {
      $provide.value('$ionicViewService', {
        getBackView: jasmine.createSpy('getBackView').andCallFake(function() {
          return backView;
        })
      });
    }));

    var parent, el, $scope;
    function setup(locals) {
      parent = angular.element('<div>');
      var ctrl;
      inject(function($controller, $rootScope) {
        el = angular.element('<div>' +
                        '<div class="buttons left-buttons"></div>' +
                        '<h1 class="title" ng-bind-html="title"></h1>' +
                        '<div class="buttons right-buttons"></div>' +
                        '</div>');
        parent.append(el);
        $scope = $rootScope.$new();

        ctrl = $controller('$ionicNavBar', {
          $element: el,
          $scope: $scope,
          $attrs: {}
        });
        ctrl._headerBarView = { align: jasmine.createSpy('align') };
      });
      return ctrl;
    }

    it('should set controller-data on parent as well for easier access', function() {
      var ctrl = setup();
      expect(parent.data('$ionNavBarController')).toBe(ctrl);
    });

    it('should expose leftButtonsElement', function() {
      var ctrl = setup();
      expect(ctrl.leftButtonsElement.hasClass('left-buttons')).toBe(true);
    });
    it('should expose rightButtonsElement', function() {
      var ctrl = setup();
      expect(ctrl.rightButtonsElement.hasClass('right-buttons')).toBe(true);
    });

    it('should go back', inject(function($ionicViewService) {
      var ctrl = setup();
      ctrl.back();
      expect($ionicViewService.getBackView).toHaveBeenCalled();
      expect(backView.go).toHaveBeenCalled();
    }));

    it('should align', function() {
      var ctrl = setup();
      expect($scope.backButtonShown).toBeUndefined();
      ctrl.showBackButton(true);
      expect($scope.backButtonShown).toBe(true);
      ctrl.showBackButton(false);
      expect($scope.backButtonShown).toBe(false);
    });

    it('should showBackButton', function() {
      var ctrl = setup();
      expect($scope.backButtonShown).toBeUndefined();
      ctrl.showBackButton(true);
      expect($scope.backButtonShown).toBe(true);
      ctrl.showBackButton(false);
      expect($scope.backButtonShown).toBe(false);
    });

    it('showBar should set isInvisible', function() {
      var ctrl = setup();
      expect($scope.isInvisible).toBeUndefined();
      ctrl.showBar(true);
      expect($scope.isInvisible).toBe(false);
      ctrl.showBar(false);
      expect($scope.isInvisible).toBe(true);
    });

    it('showBar should set $parent.$hasHeader', function() {
      var ctrl = setup();
      expect($scope.$parent.$hasHeader).toBeUndefined();
      ctrl.showBar(true);
      expect($scope.$parent.$hasHeader).toBe(true);
      ctrl.showBar(false);
      expect($scope.$parent.$hasHeader).toBe(false);
    });

    it('should setTitle', function() {
      var ctrl = setup();
      expect($scope.title).toBeFalsy();
      expect($scope.oldTitle).toBeFalsy();
      ctrl.setTitle('foo');
      expect($scope.title).toBe('foo');
      expect($scope.oldTitle).toBeFalsy();
      ctrl.setTitle('bar');
      expect($scope.title).toBe('bar');
      expect($scope.oldTitle).toBe('foo');
      ctrl.setTitle('baz');
      expect($scope.title).toBe('baz');
      expect($scope.oldTitle).toBe('bar');
    });

    it('setTitle should not change if title is same as old', function() {
      var ctrl = setup();
      ctrl.setTitle('okay');
      expect($scope.title).toBe('okay');
      expect($scope.oldTitle).toBeFalsy();
      ctrl.setTitle('okay');
      expect($scope.title).toBe('okay');
      expect($scope.oldTitle).toBeFalsy();
      ctrl.setTitle('okay-2');
      expect($scope.title).toBe('okay-2');
      expect($scope.oldTitle).toBe('okay');
    });

    it('should getTitle', function() {
      var ctrl = setup();
      expect(ctrl.getTitle()).toBeFalsy();
      ctrl.setTitle('bar');
      expect(ctrl.getTitle()).toBe('bar');
      ctrl.setTitle('baz');
      expect(ctrl.getTitle()).toBe('baz');
    });

    it('should getPreviousTitle', function() {
      var ctrl = setup();
      expect(ctrl.getPreviousTitle()).toBeFalsy();
      ctrl.setTitle('foo');
      expect(ctrl.getPreviousTitle()).toBeFalsy();
      ctrl.setTitle('bar');
      expect(ctrl.getPreviousTitle()).toBe('foo');
      ctrl.setTitle('baz');
      expect(ctrl.getPreviousTitle()).toBe('bar');
    });

    describe('changeTitle', function() {
      var ctrl;
      beforeEach(function() {
        ctrl = setup();
        ctrl._animateTitles = jasmine.createSpy('animateTitles');
      });

      it('should do nothing if title is same', function() {
        ctrl.setTitle('123');
        expect($scope.title).toBe('123');
        expect(ctrl.changeTitle('123')).toBe(false);
      });

      it('should set isReverse', function() {
        expect($scope.isReverse).toBeFalsy();
        ctrl.changeTitle('foo', 'back');
        expect($scope.isReverse).toBe(true);
        ctrl.changeTitle('bar', 'this is not back');
        expect($scope.isReverse).toBe(false);
      });

      it('should set shouldAnimate', function() {
        expect($scope.shouldAnimate).toBeFalsy();
        ctrl.changeTitle('foo', 'someDirection');
        expect($scope.shouldAnimate).toBe(true);
        ctrl.changeTitle('bar', '');
        expect($scope.shouldAnimate).toBe(false);
      });

      it('should call setTitle', function() {
        expect($scope.oldTitle).toBeFalsy();
        spyOn(ctrl, 'setTitle');
        ctrl.changeTitle('title1');
        expect(ctrl.setTitle).toHaveBeenCalledWith('title1');
        ctrl.changeTitle('title2');
        expect(ctrl.setTitle).toHaveBeenCalledWith('title2');
      });

      it('should only align if no navDirection', function() {
        expect(ctrl._headerBarView.align).not.toHaveBeenCalled();
        ctrl.changeTitle('title1', null);
        expect(ctrl._headerBarView.align).toHaveBeenCalled();
        expect(ctrl._animateTitles).not.toHaveBeenCalled();
      });

      it('should animateTitles if a navDirection given', function() {
        expect(ctrl._animateTitles).not.toHaveBeenCalled();
        ctrl.changeTitle('title1', 'back');
        expect(ctrl._headerBarView.align).not.toHaveBeenCalled();
        expect(ctrl._animateTitles).toHaveBeenCalled();
      });
    });

    describe('animateTitles', function() {
      var ctrl;
      beforeEach(function() {
        ctrl = setup();
        //Add an extra h1 just so we can test that it gets removed
        el.append('<h1 class="title filler-element"></h1>');
        ionic.requestAnimationFrame = function(cb) { cb(); };
      });

      it('before raf should replace title with oldTitle', function() {
        //Make raf do nothing so we can test what happens before it
        ionic.requestAnimationFrame = function(){};

        $scope.oldTitle = 'someTitle';
        ctrl._animateTitles();
        var titles = el[0].querySelectorAll('.title');
        expect(titles.length).toBe(2);
        expect(titles[0].getAttribute('ng-bind-html')).toEqual('oldTitle');
        expect(titles[1].classList.contains('filler-element')).toBe(true);
      });

      it('after raf should have changed titles & cleaned up', inject(function($animate) {
        var enterCallback;
        $animate.leave = jasmine.createSpy('leave');
        $animate.enter = jasmine.createSpy('enter').andCallFake(function(child,parent,_,cb) {
          parent.append(child);
          enterCallback = cb;
        });
        spyOn($scope, '$digest');
        ctrl._animateTitles();
        var oldTitle = el[0].querySelector('[ng-bind-html="oldTitle"]');
        var title = el[0].querySelector('[ng-bind-html="title"]');
        expect($animate.leave.mostRecentCall.args[0][0]).toBe(oldTitle);
        expect($animate.enter.mostRecentCall.args[0][0]).toBe(title);
        expect(el[0].querySelector('h1.filler-element')).toBe(null);

        expect($scope.$digest).toHaveBeenCalled();
        expect(title.classList.contains('invisible')).toBe(false);
      }));

    });
  });

  describe('directive', function() {
    beforeEach(module('ionic'));
    function setup(attrs, content) {
      var el;
      inject(function($compile, $rootScope) {
        el = $compile('<ion-nav-bar '+(attrs||'')+'>'+(content||'')+'</ion-nav-bar>')($rootScope.$new());
        $rootScope.$apply();
      });
      return el;
    }

    it('should prepend-transclude content', function() {
      var el = setup('', '<span><b>super</b> content {{4}}</span>');
      expect(el.children().eq(0).html()).toBe('<b>super</b> content 4');
    });

    it('should set $parent.$hasHeader to false on $scope.$destroy', function() {
      var el = setup();
      var parentScope = el.scope().$parent;
      parentScope.$hasHeader = true;
      el.scope().$destroy();
      expect(parentScope.$hasHeader).toBe(false);
    });

    it('should register with $ionicNavBarDelegate', inject(function($ionicNavBarDelegate) {
      var deregisterSpy = jasmine.createSpy('deregister');
      spyOn($ionicNavBarDelegate, '_registerInstance').andCallFake(function() {
        return deregisterSpy;
      });

      var el = setup('delegate-handle="theBestHandle"');
      expect($ionicNavBarDelegate._registerInstance)
        .toHaveBeenCalledWith(el.controller('ionNavBar'), 'theBestHandle');

      expect(deregisterSpy).not.toHaveBeenCalled();
      el.scope().$destroy();
      expect(deregisterSpy).toHaveBeenCalled();
    }));

    it('should have invisible class (default true)', function() {
      var el = setup();
      el.scope().$apply();
      expect(el.hasClass('invisible')).toBe(true);
      el.scope().$apply('isInvisible = false');
      expect(el.hasClass('invisible')).toBe(false);
      el.scope().$apply('isInvisible = true');
      expect(el.hasClass('invisible')).toBe(true);
    });

    it('should have reverse class', function() {
      var el = setup();
      expect(el.hasClass('reverse')).toBe(false);
      el.scope().$apply('isReverse = true');
      expect(el.hasClass('reverse')).toBe(true);
      el.scope().$apply('isReverse = false');
      expect(el.hasClass('reverse')).toBe(false);
    });
  });

  describe('platforms', function() {
    function setup(attrs, content) {
      var el;
      inject(function($compile, $rootScope) {
        el = $compile('<ion-nav-bar '+(attrs||'')+'>'+(content||'')+'</ion-nav-bar>')($rootScope.$new());
        $rootScope.$apply();
      });
      return el;
    }

    describe('iOS', function() {
      beforeEach(module('ionic', function($provide) {
        TestUtil.setPlatform('ios');
        $provide.constant('$ionicNavBarConfig', {
          alignTitle: 'center',
          transition: 'nav-title-slide-ios7',
          backButtonIcon: 'ion-ios7-arrow-back'
        });
      }));

      it('should have correct title align', function() {
        var el = setup();
        var controller = el.controller('ionNavBar');
        expect(controller._headerBarView.alignTitle).toBe('center');
      });

      it('Should have correct transition', function() {
        var el = setup();
        expect(el.hasClass('nav-title-slide-ios7')).toBe(true);
      });

      it('should not add transition if animation attribute is defined', function() {
        var el = setup('animation="123abc"');
        expect(el.hasClass('123abc')).toBe(true);
        expect(el.hasClass('nav-title-slide-ios7')).toBe(false);
      });
    });

    describe('Android', function() {
      beforeEach(module('ionic', function($provide) {
        TestUtil.setPlatform('android');
        $provide.constant('$ionicNavBarConfig', {
          alignTitle: 'left',
          transition: 'no-animation',
          backButtonIcon: 'ion-android-back'
        });
      }));

      it('should have correct title align', function() {
        var el = setup();
        var controller = el.controller('ionNavBar');
        expect(controller._headerBarView.alignTitle).toBe('left');
      });

      it('Should have correct transition', function() {
        var el = setup();
        // Nav bar titles don't animation by default on Android
        expect(el.hasClass('no-animation')).toBe(true);
      });

      it('should not add transition if animation attribute is defined', function() {
        var el = setup('animation="123abc"');
        expect(el.hasClass('123abc')).toBe(true);
        expect(el.hasClass('no-animation')).toBe(false);
      });
    });
  });
});
