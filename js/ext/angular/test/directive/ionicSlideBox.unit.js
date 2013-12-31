/**
 * Test the slide box directive. For more test coverage of the slide box,
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
    </slide-box>')($rootScope);
  }));

  it('Should init', function() {
    var scope = el.scope();
    expect(scope.slideBox).not.toBe(undefined);
  });
});

describe('Ionic Angular Slide Box with maxViewableSlide Set', function() {
  var el;

  beforeEach(module('ionic.ui.slideBox'));

  beforeEach(inject(function($compile, $rootScope) {
    el = $compile('<slide-box max-viewable-slide="2">\
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
});