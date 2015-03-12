describe('bar directives', function() {
  beforeEach(module('ionic'));

  ['ion-header-bar'].forEach(function(tpl) {
    describe('tapScrollToTop ' + tpl, function() {
      function setup(attrs) {
        var el;
        inject(function($compile, $rootScope) {
          el = angular.element('<' + tpl + ' ' + (attrs||'') + '>');
          var container = angular.element('<ion-content>').append(el);
          ionic.requestAnimationFrame = function(cb) { cb(); };
          $compile(container)($rootScope.$new());
          container.controller('$ionicScroll').scrollTop = jasmine.createSpy('scrollTop');
          $rootScope.$apply();
        });
        return el;
      }
      it('should not listen for tap if attr.noTapScroll', function() {
        spyOn(ionic, 'on');
        setup('no-tap-scroll="true"');
        expect(ionic.on).not.toHaveBeenCalledWith('tap');
      });

      it('should listen for tap, unlisten on destroy', function() {
        var callback;
        spyOn(ionic, 'on').andCallFake(function(name, cb) {
          callback = cb;
        });
        spyOn(ionic, 'off');
        var el = setup();
        expect(ionic.on.mostRecentCall.args[0]).toBe('tap');
        expect(ionic.off).not.toHaveBeenCalled();
        el.scope().$destroy();
        expect(ionic.off.mostRecentCall.args[0]).toBe('tap');
        expect(ionic.off.mostRecentCall.args[1]).toBe(callback);
        expect(ionic.off.mostRecentCall.args[2]).toBe(el[0]);
      });
      ['input','textarea','select'].forEach(function(tag) {
        it('should ignore tap if it\'s in a ' + tag, function() {
          var el = setup();
          spyOn(ionic.DomUtil, 'rectContains');
          var child = angular.element('<' + tag + '>');
          el.append(child);
          ionic.trigger('tap', { target: child[0] }, true, true);
          expect(ionic.DomUtil.rectContains).not.toHaveBeenCalled();
        });
      });
      it('should ignore tap if it\'s in a [contenteditable]', function() {
        var el = setup();
        spyOn(ionic.DomUtil, 'rectContains');
        var child = angular.element('<div contenteditable>');
        el.append(child);
        ionic.trigger('tap', { target: child[0] }, true, true);
        expect(ionic.DomUtil.rectContains).not.toHaveBeenCalled();
      });
      it('should ignore tap if it\'s in a .button', function() {
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
  });

  angular.forEach([{
    tag: 'ion-header-bar',
    className: 'bar bar-header'
  }, {
    tag: 'ion-footer-bar',
    className: 'bar bar-footer'
  }], function(data) {
    describe(data.tag, function() {

      function setup(attrs) {
        var el;
        ionic.views.HeaderBar = function(opts) {
          this.alignTitle = opts.alignTitle;
          this.el = opts.el;
          this.align = jasmine.createSpy('align');
        };
        inject(function($compile, $rootScope) {
          el = angular.element('<'+data.tag+' '+(attrs||'')+'></'+data.tag+'>');
          el = $compile(el)($rootScope.$new());
          $rootScope.$apply();
        });
        return el;
      }

      if (data.tag === 'ion-header-bar') {
        it('$hasHeader $hasSubheader', function() {
          var el = setup();
          var scope = el.scope();
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
          el.addClass('ng-hide');
          scope.$apply();
          expect(scope.$hasHeader).toEqual(false);
          expect(scope.$hasSubheader).toEqual(false);
          el.removeClass('ng-hide');
          scope.$apply();
          expect(scope.$hasHeader).toEqual(true);
          expect(scope.$hasSubheader).toEqual(false);
        });
      } else {
        it('$hasFooter $hasSubheader', function() {
          var el = setup();
          var scope = el.scope();
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
          el.addClass('ng-hide');
          scope.$apply();
          expect(scope.$hasFooter).toEqual(false);
          expect(scope.$hasSubfooter).toEqual(false);
          el.removeClass('ng-hide');
          scope.$apply();
          expect(scope.$hasFooter).toEqual(true);
          expect(scope.$hasSubfooter).toEqual(false);
        });
        it('.has-tabs', function() {
          var el = setup();
          var scope = el.scope();
          expect(el.hasClass('has-tabs')).toBe(false);
          scope.$apply('$hasTabs = true');
          expect(el.hasClass('has-tabs')).toBe(true);
          scope.$apply('$hasTabs = false');
          expect(el.hasClass('has-tabs')).toBe(false);
        });
        it('.has-tabs-top', inject(function($document, $timeout) {
          $document[0].body.appendChild(angular.element('<div class="tabs-top"></div>')[0]);
          var el = setup();
          $document[0].body.appendChild(el[0]);
          expect(el.hasClass('has-tabs-top')).toBe(false);
          if (data.tag === 'ion-header-bar') {
            $timeout.flush();
            expect(el.hasClass('has-tabs-top')).toBe(true);
          }
        }));
      }

      it('should compile to ' + data.className, function() {
        var el = setup();
        expect(el.hasClass(data.className)).toBe(true);
      });
    });
  });
});
