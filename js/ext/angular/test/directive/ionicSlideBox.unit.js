/**
 * Test the side menu directive. For more test coverage of the side menu,
 * see the core Ionic sideMenu controller tests.
 */
describe('Ionic Angular Slide Box', function() {
  var el, delegate, compile, rootScope, timeout;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope, $timeout, $ionicSlideBoxDelegate) {
    delegate = $ionicSlideBoxDelegate;
    timeout = $timeout;
    rootScope = $rootScope;
    compile = $compile;

    el = $compile('<ion-slide-box>\
      <ion-slide>\
        <div class="box blue">\
          <h1>BLUE {{slideBox.slideIndex}}</h1>\
        </div>\
      </ion-slide>\
      <ion-slide>\
        <div class="box yellow">\
          <h1>YELLOW {{slideBox.slideIndex}}</h1>\
        </div>\
      </ion-slide>\
      <ion-slide>\
      <div class="box pink"><h1>PINK {{slideBox.slideIndex}}</h1></div>\
      </ion-slide>\
    </ion-slide-box>')($rootScope);
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

  it('Should set initial active slide', function() {
    el = compile('<ion-slide-box active-slide="2">\
      <ion-slide>\
        <div class="box blue">\
          <h1>BLUE {{slideBox.slideIndex}}</h1>\
        </div>\
      </ion-slide>\
      <ion-slide>\
        <div class="box yellow">\
          <h1>YELLOW {{slideBox.slideIndex}}</h1>\
        </div>\
      </ion-slide>\
      <ion-slide>\
      <div class="box pink"><h1>PINK {{slideBox.slideIndex}}</h1></div>\
      </ion-slide>\
    </ion-slide-box>')(rootScope);

   var scope = el.scope();
   expect(scope.slideBox.getPos()).toBe(2);
  });
});
