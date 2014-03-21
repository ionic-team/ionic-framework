describe('bar directives', function() {
  beforeEach(module('ionic'));

  describe('tapScrollToTop', function() {
    function setup() {
      var el;
      inject(function($compile, $rootScope) {
        el = angular.element('<ion-header-bar>')
        var container = angular.element('<ion-content>').append(el);
        ionic.requestAnimationFrame = function(cb) { cb(); };
        $compile(container)($rootScope.$new());
        container.controller('$ionicScroll').scrollTop = jasmine.createSpy('scrollTop')
        $rootScope.$apply();
      });
      return el;
    }
    it('should listen for tap, unlisten on destroy', function() {
      var callback;
      spyOn(ionic, 'on').andCallFake(function(name, cb) {
        callback = cb;
      });
      spyOn(ionic, 'off');
      var el = setup();
      expect(ionic.on).toHaveBeenCalledWith('tap', jasmine.any(Function), el[0]);
      expect(ionic.off).not.toHaveBeenCalled();
      el.scope().$destroy();
      expect(ionic.off).toHaveBeenCalledWith('tap', callback, el[0]);
    });
    it('should ignore tap if it\'s in a button', function() {
      var el = setup();
      spyOn(ionic.DomUtil, 'rectContains');
      var child = angular.element('<div class="button">');
      el.append(child);
      ionic.trigger('tap', { target: child[0] }, true, true);
      expect(ionic.DomUtil.rectContains).not.toHaveBeenCalled();
    });
    it('should scrollTop if tap is inside headerBar', function() {
      var el = setup();
      spyOn(ionic.DomUtil, 'rectContains').andCallFake(function() {
        return true;
      });
      ionic.trigger('tap', { target: el[0], touches: [{pageX:0,pageY:0}] });
      expect(el.controller('$ionicScroll').scrollTop).toHaveBeenCalledWith(true);
    });
    it('should not scrollTop if tap isnt inside headerBar', function() {
      var el = setup();
      spyOn(ionic.DomUtil, 'rectContains').andCallFake(function() {
        return false;
      });
      ionic.trigger('tap', { target: el[0], touches: [{pageX:0,pageY:0}] });
      expect(el.controller('$ionicScroll').scrollTop).not.toHaveBeenCalled();
    });
  });

  angular.forEach([{
    tag: 'ion-header-bar',
    className: 'bar bar-header',
    controllerBind: '$ionicHeaderBarController'
  }, {
    tag: 'ion-footer-bar',
    className: 'bar bar-footer',
    controllerBind: '$ionicFooterBarController'
  }], function(data) {
    describe(data.tag, function() {

      function setup(attrs) {
        var el;
        ionic.views.HeaderBar = function(opts) {
          this.opts = opts;
          this.align = jasmine.createSpy('align');
        };
        inject(function($compile, $rootScope) {
          el = angular.element('<'+data.tag+' '+(attrs||'')+'>');
          el = $compile(el)($rootScope.$new());
          $rootScope.$apply();
        });
        return el;
      }

      if (data.tag === 'ion-header-bar') {
        it('$hasHeader $hasSubheader', function() {
          var el = setup();
          var scope = el.scope().$parent;
          expect(scope.$hasHeader).toEqual(true);
          expect(scope.$hasSubheader).toEqual(false);
          el.addClass('bar-subheader');
          scope.$apply();
          expect(scope.$hasHeader).toEqual(false);
          expect(scope.$hasSubheader).toEqual(true);
          el.removeClass('bar-subheader');
          scope.$apply();
          expect(scope.$hasHeader).toEqual(true);
          expect(scope.$hasSubheader).toEqual(false);
        });
      } else {
        it('$hasFooter $hasSubheader', function() {
          var el = setup();
          var scope = el.scope().$parent;
          expect(scope.$hasFooter).toEqual(true);
          expect(scope.$hasSubfooter).toEqual(false);
          el.addClass('bar-subfooter');
          scope.$apply();
          expect(scope.$hasFooter).toEqual(false);
          expect(scope.$hasSubfooter).toEqual(true);
          el.removeClass('bar-subfooter');
          scope.$apply();
          expect(scope.$hasFooter).toEqual(true);
          expect(scope.$hasSubfooter).toEqual(false);
        });
        it('.has-tabs', function() {
          var el = setup();
          var scope = el.scope().$parent;
          expect(el.hasClass('has-tabs')).toBe(false);
          scope.$apply('$hasTabs = true');
          expect(el.hasClass('has-tabs')).toBe(true);
          scope.$apply('$hasTabs = false');
          expect(el.hasClass('has-tabs')).toBe(false);
        });
      }

      it('should compile to ' + data.className, function() {
        var el = setup();
        expect(el.hasClass(data.className)).toBe(true);
      });

      it('should assign views.HeaderBar to default controllerBind', function() {
        var el = setup();
        expect(el.scope()[data.controllerBind] instanceof ionic.views.HeaderBar).toBe(true);
      });
      it('should assign views.HeaderBar to attr controllerBind', function() {
        var el = setup('controller-bind="monkeys"');
        expect(el.scope().monkeys instanceof ionic.views.HeaderBar).toBe(true);
      });

      it('should pass center to views.HeaderBar option by default', function() {
        var el = setup();
        expect(el.scope()[data.controllerBind].opts.alignTitle).toBe('center');
      });
      it('should pass attr.alignTitle to views.HeaderBar', function() {
        var el = setup('align-title="left"');
        expect(el.scope()[data.controllerBind].opts.alignTitle).toBe('left');
      });
    });
  });
});
