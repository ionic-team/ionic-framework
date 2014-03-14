describe('bar directives', function() {
  beforeEach(module('ionic'));

  angular.forEach([{
    tag: 'ion-header-bar',
    element: 'header',
    model: 'headerBarController'
  }, {
    tag: 'ion-footer-bar',
    element: 'footer',
    model: 'footerBarController'
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

      it('should compile to ' + data.element, function() {
        var el = setup();
        expect(el[0].tagName.toLowerCase()).toBe(data.element);
      });

      it('should assign views.HeaderBar to default model', function() {
        var el = setup();
        expect(el.scope()[data.model] instanceof ionic.views.HeaderBar).toBe(true);
      });
      it('should assign views.HeaderBar to attr model', function() {
        var el = setup('model="monkeys"');
        expect(el.scope().monkeys instanceof ionic.views.HeaderBar).toBe(true);
      });

      it('should pass center to views.HeaderBar option by default', function() {
        var el = setup();
        expect(el.scope()[data.model].opts.alignTitle).toBe('center');
      });
      it('should pass attr.alignTitle to views.HeaderBar', function() {
        var el = setup('align-title="left"');
        expect(el.scope()[data.model].opts.alignTitle).toBe('left');
      });
    });
  });
});
