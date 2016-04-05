describe('$ionicScroll Controller', function() {

  beforeEach(module('ionic'));

  beforeEach(function() {
    ionic.Platform.ready = function(cb) { cb(); };
    ionic.requestAnimationFrame = function(cb) { cb(); };
  });

  var scope, ctrl, timeout, nativeScrolling;
  function setup(options) {
    options = options || {};
    options.nativeScrolling = nativeScrolling || false;

    options.el = options.el ||
      //scrollView requires an outer container element and a child
      //content element
      angular.element('<div><div></div></div>')[0];
    angular.element('<div>').append(options.el);

    inject(function($controller, $rootScope, $timeout) {
      scope = $rootScope.$new();
      ctrl = $controller('$ionicScroll', {
        $scope: scope,
        scrollViewOptions: options
      });
      spyOn(ctrl.scrollView, 'run'); // don't actually call run, this is a dumb test
      timeout = $timeout;
    });
  }
  [false, true].forEach(function(nativeScrollingSetting) {

    it('should register with no handle', inject(function ($ionicScrollDelegate) {
      nativeScrolling = nativeScrollingSetting;
      var deregisterSpy = jasmine.createSpy('deregister');
      spyOn($ionicScrollDelegate, '_registerInstance').andCallFake(function(){
        return deregisterSpy;
      });
      var el = setup();
      expect($ionicScrollDelegate._registerInstance).toHaveBeenCalledWith(ctrl, undefined, jasmine.any(Function));
    }));

    it('should register with given handle and deregister on destroy', inject(function ($ionicScrollDelegate) {
      nativeScrolling = nativeScrollingSetting;
      var deregisterSpy = jasmine.createSpy('deregister');
      spyOn($ionicScrollDelegate, '_registerInstance').andCallFake(function () {
        return deregisterSpy;
      });
      setup({
        delegateHandle: 'something'
      });
      expect($ionicScrollDelegate._registerInstance)
        .toHaveBeenCalledWith(ctrl, 'something', jasmine.any(Function));

      expect(deregisterSpy).not.toHaveBeenCalled();
      scope.$destroy();
      expect(deregisterSpy).toHaveBeenCalled();
    }));

    it('should set bouncing to option if given', function () {
      nativeScrolling = nativeScrollingSetting;
      spyOn(ionic.Platform, 'isAndroid');
      setup({
        bouncing: true
      });
      expect(ionic.Platform.isAndroid).not.toHaveBeenCalled();
    });
    it('should set bouncing false if isAndroid true', function () {
      nativeScrolling = nativeScrollingSetting;
      spyOn(ionic.Platform, 'isAndroid').andCallFake(function () {
        return true;
      });
      setup();
      expect(ctrl.scrollView.options.bouncing).toBe(false);
    });
    it('should set bouncing true if android false', function () {
      nativeScrolling = nativeScrollingSetting;
      spyOn(ionic.Platform, 'isAndroid').andCallFake(function () {
        return false;
      });
      setup();
      expect(ctrl.scrollView.options.bouncing).toBe(true);
    });

    it('should set this.element and this.$element', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      expect(ctrl.element.tagName).toMatch(/div/i);
      expect(ctrl.$element[0]).toBe(ctrl.element);
    });

    it('should register scrollView as this.scrollView', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      if (nativeScrolling) {
        expect(ctrl.scrollView instanceof ionic.views.ScrollNative).toBe(true);
      }else {
        expect(ctrl.scrollView instanceof ionic.views.Scroll).toBe(true);
      }
    });

    it('should register controller on element.data', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      expect(ctrl.$element.parent().data('$$ionicScrollController')).toBe(ctrl);
    });

    it('should run after a timeout', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      timeout.flush();
      expect(ctrl.scrollView.run).toHaveBeenCalled();
    });

    it('should listen to scroll event and call $onScroll', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      scope.$onScroll = jasmine.createSpy();

      expect(scope.$onScroll).not.toHaveBeenCalled();

      ionic.trigger('scroll', {target: ctrl.element});
      expect(scope.$onScroll).toHaveBeenCalled();
      expect(scope.$onScroll.mostRecentCall.args[0].scrollLeft).toBe(0);
      expect(scope.$onScroll.mostRecentCall.args[0].scrollTop).toBe(0);

      scope.$onScroll.reset();
      ionic.trigger('scroll', {target: ctrl.element, scrollTop: 3, scrollLeft: 4});
      expect(scope.$onScroll.mostRecentCall.args[0].scrollLeft).toBe(4);
      expect(scope.$onScroll.mostRecentCall.args[0].scrollTop).toBe(3);
    });

    it('.getScrollView', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      expect(ctrl.getScrollView()).toBe(ctrl.scrollView);
    });
    it('.getScrollPosition', function () {
      nativeScrolling = nativeScrollingSetting;
      setup();
      var values = {};
      spyOn(ctrl.scrollView, 'getValues').andReturn(values);
      expect(ctrl.getScrollPosition()).toBe(values);
    });

    [false, true].forEach(function (shouldAnimate) {
      describe('with animate=' + shouldAnimate, function () {

        describe('scroll action', function () {
          beforeEach(function () {
            nativeScrolling = nativeScrollingSetting;
            setup();
            //Mock resize to insta-call through for easier tests
            ctrl.resize = function () {
              return {
                then: function (cb) {
                  cb();
                }
              };
            };
          });
          it('.scrollTop', function () {
            spyOn(ctrl.scrollView, 'scrollTo');
            ctrl.scrollTop(shouldAnimate);
            expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(0, 0, shouldAnimate);
          });
          it('.scrollBottom', function () {
            spyOn(ctrl.scrollView, 'scrollTo');
            spyOn(ctrl.scrollView, 'getScrollMax').andCallFake(function () {
              return {left: 33, top: 44};
            });
            ctrl.scrollBottom(shouldAnimate);
            expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(33, 44, shouldAnimate);
          });
          it('.scrollTo', function () {
            spyOn(ctrl.scrollView, 'scrollTo');
            ctrl.scrollTo(1, 2, shouldAnimate);
            expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(1, 2, shouldAnimate);
          });
          it('.scrollBy', function () {
            spyOn(ctrl.scrollView, 'scrollBy');
            ctrl.scrollBy(1, 2, shouldAnimate);
            expect(ctrl.scrollView.scrollBy).toHaveBeenCalledWith(1, 2, shouldAnimate);
          });
          it('.anchorScroll without hash should scrollTop', inject(function ($location, $document) {
            $document[0].getElementById = jasmine.createSpy();
            $location.hash = function () {
              return null;
            };
            spyOn(ctrl.scrollView, 'scrollTo');
            ctrl.anchorScroll(shouldAnimate);
            expect($document[0].getElementById).not.toHaveBeenCalled();
            expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(0, 0, shouldAnimate);
          }));
          it('.anchorScroll with hash but no element should scrollTop', inject(function ($location, $document) {
            $document[0].getElementById = jasmine.createSpy();
            $location.hash = function () {
              return 'foo';
            };
            spyOn(ctrl.scrollView, 'scrollTo');
            ctrl.anchorScroll(shouldAnimate);
            expect($document[0].getElementById).toHaveBeenCalledWith('foo');
            expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(0, 0, shouldAnimate);
          }));
          it('.anchorScroll with el matching hash should scroll to it', inject(function ($location, $document) {
            $document[0].getElementById = jasmine.createSpy('byId').andCallFake(function () {
              return {
                offsetLeft: 8,
                offsetTop: 9,
                attributes: [],
                offsetParent: {}
              };
            });
            spyOn($location, 'hash').andCallFake(function () {
              return 'foo';
            });
            spyOn(ctrl.scrollView, 'scrollTo');
            ctrl.anchorScroll(shouldAnimate);
            expect(ctrl.scrollView.scrollTo).toHaveBeenCalledWith(8, 9, shouldAnimate);
          }));
        });
      });
    });

    it('.anchorScroll with el matching hash should scroll to it, even if the el is not directly below the list', function () {
      nativeScrolling = nativeScrollingSetting;
      var ele = {
        offsetLeft: 8,
        offsetTop: 9,
        attributes: [],
        offsetParent: {
          offsetLeft: 10,
          offsetTop: 11,
          attributes: [],
          offsetParent: {}
        }
      };
      module('ionic', function ($provide) {
        $provide.value('$document', [{
          getElementById: function () {
            return ele;
          }, createElement: function (tagName) {
            return document.createElement(tagName);
          }
        }]);
      });
      inject(function ($controller, $rootScope, $location, $timeout) {
        var scrollCtrl = $controller('$ionicScroll', {
          $scope: $rootScope.$new(),
          $element: jqLite('<div><div></div></div>'),
          scrollViewOptions: {el: jqLite('<div><div></div></div>')[0]}
        });
        spyOn($location, 'hash').andCallFake(function () {
          return 'bar';
        });
        spyOn(scrollCtrl.scrollView, 'scrollTo');
        scrollCtrl.anchorScroll()
        $timeout.flush();
        expect(scrollCtrl.scrollView.scrollTo.mostRecentCall.args).toEqual([18, 20, false]);
      });
    });

    it('should not activatePullToRefresh if setRefresher is not called', function () {
      setup();
      timeout.flush();
      expect(ctrl.refresher).toBeFalsy();
      spyOn(ctrl.scrollView, 'activatePullToRefresh');
      expect(ctrl.scrollView.activatePullToRefresh).not.toHaveBeenCalled();
    });
  });

  it('should activatePullToRefresh and work when setRefresher', inject(function($compile) {
    var refresherEl,
        activateCB,
        deactivateCB,
        startCB,
        showCB,
        hideCB,
        tailCB,
        onPullProgressCB;
    nativeScrolling = false;
    setup({
      el: angular.element('<div><ion-refresher class="refresher"></ion-refresher></div>')[0]
    });

    $compile(ctrl.element)(scope);
    scope.$apply();

    spyOn(ctrl.scrollView, 'activatePullToRefresh').andCallFake(function(height, start, done, refreshing,  show, hide, tail, onPull) {
      activateCB = start;
      deactivateCB = done;
      startCB = refreshing;
      showCB = show;
      hideCB = hide;
      tailCB = tail;
      onPullProgressCB = onPull;
    });

    var refresher = ctrl.refresher;
    var refreshCtrl = angular.element(refresher).controller('ionRefresher');
    var dm = refreshCtrl.getRefresherDomMethods()

    ctrl._setRefresher(
      scope,
      ctrl.element,
      dm
    );

    var scrollOnRefreshSpy = jasmine.createSpy('scroll.onRefresh');

    scope.$onRefresh = jasmine.createSpy('onRefresh');
    scope.$onPulling = jasmine.createSpy('onPulling');

    timeout.flush();

    expect(refresher.classList.contains('active')).toBe(false);
    expect(refresher.classList.contains('refreshing')).toBe(false);

    dm.activate();
    expect(refresher.classList.contains('active')).toBe(true);
    expect(refresher.classList.contains('refreshing')).toBe(false);
    expect(scope.$onPulling).toHaveBeenCalled();
    expect(scope.$onRefresh).not.toHaveBeenCalled();

    dm.start();
    expect(refresher.classList.contains('refreshing')).toBe(true);
    expect(scope.$onRefresh).toHaveBeenCalled();

    dm.deactivate();
    timeout.flush();
    expect(refresher.classList.contains('active')).toBe(false);

    dm.show();
    expect(refresher.classList.contains('invisible')).toBe(false);

    dm.hide();
    expect(refresher.classList.contains('invisible')).toBe(true);
  }));

});
