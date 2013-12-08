/**
 * Test the side menu directive. For more test coverage of the side menu,
 * see the core Ionic sideMenu controller tests.
 */
describe('Ionic Angular Slide Box', function() {
  var el;

  beforeEach(module('ionic.ui.slideBox'));

  beforeEach(inject(function($compile, $rootScope) {
    el = $compile('<slide-box>\
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
    </slide-box>');
  }));

  it('Should init', function() {
    var scope = el.scope();
    expect(scope.slideBox).not.toBe(undefined);
  });
});
