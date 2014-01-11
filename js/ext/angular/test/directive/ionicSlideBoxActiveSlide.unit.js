/**
 * Test the side menu directive. For more test coverage of the side menu,
 * see the core Ionic sideMenu controller tests.
 */
describe('Ionic Angular Slide Box', function() {
  var el, delegate, timeout;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, SlideBoxDelegate) {
    delegate = SlideBoxDelegate;
    timeout = $timeout;
    el = $compile('<slide-box active-slide="1">\
      <slide>\
        <div class="box blue">\
          <h1>BLUE {{slideBox.slideIndex}}</h1>\
        </div>\
      </slide>\
      <slide>\
        <div class="box yellow">\
          <h1>YELLOW {{slideBox.slideIndex}}</h1>\
        </div>\
      </slide>\
      <slide>\
      <div class="box pink"><h1>PINK {{slideBox.slideIndex}}</h1></div>\
      </slide>\
    </slide-box>')($rootScope);
  }));

  it('Should init', function() {
    var scope = el.scope();
    expect(scope.slideBox).not.toBe(undefined);
  });

  it('Should update with delegate', function() {
    var scope = el.scope();
    var slideBox = scope.slideBox;
    spyOn(slideBox, 'setup');
    delegate.update();
    timeout.flush();
    expect(slideBox.setup).toHaveBeenCalled();
  });
});