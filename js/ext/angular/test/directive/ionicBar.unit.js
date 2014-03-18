describe('bar directives', function() {
  beforeEach(module('ionic'));

  angular.forEach([{
    tag: 'ion-header-bar',
    element: 'header',
    controllerBind: '$ionicHeaderBarController'
  }, {
    tag: 'ion-footer-bar',
    element: 'footer',
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

      it('should compile to ' + data.element, function() {
        var el = setup();
        expect(el[0].tagName.toLowerCase()).toBe(data.element);
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
