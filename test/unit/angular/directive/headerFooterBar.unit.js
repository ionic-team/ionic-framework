describe('bar directives', function() {
  beforeEach(module('ionic'));

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
