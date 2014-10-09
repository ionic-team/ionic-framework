describe('ionSlideBox directive', function() {
  beforeEach(module('ionic'));
  beforeEach(function() {
    spyOn(ionic, 'requestAnimationFrame').andCallFake(function(cb) { cb(); });
  });

  function makeSlideBox(template) {
    var el;
    inject(function($compile, $rootScope) {
      el = $compile('<ion-scroll>' + template + '</ion-scroll>')($rootScope);
      $rootScope.$apply();
    });
    return el.find('ion-slide-box');
  }

  it('should bind to select - > selected attr', inject(function($rootScope, $timeout) {
    var slideBox = makeSlideBox('<ion-slide-box selected="$root.currentIndex">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');

    expect(slideBoxCtrl.selected()).toBe(0);
    $timeout.flush();
    expect($rootScope.currentIndex).toBe(0);

    $rootScope.$apply('currentIndex = 2');
    expect(slideBoxCtrl.selected()).toBe(2);

    slideBoxCtrl.select(1);
    $timeout.flush();
    expect($rootScope.currentIndex).toBe(1);

    // Out of bounds should apply
    expect(slideBoxCtrl.selected()).toBe(1);
    $rootScope.$apply('currentIndex = -1');
    expect(slideBoxCtrl.selected()).toBe(-1);
    $rootScope.$apply('currentIndex = 3');
    expect(slideBoxCtrl.selected()).toBe(-1);
  }));

  it('should bind to selected attr to slide', inject(function($rootScope, $timeout) {
    $rootScope.currentIndex = 2;
    var slideBox = makeSlideBox('<ion-slide-box selected="$root.currentIndex">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');

    expect(slideBoxCtrl.selected()).toBe(2);
    expect($rootScope.currentIndex).toBe(2);
    $timeout.flush();

    slideBoxCtrl.select(1);
    $timeout.flush();
    expect($rootScope.currentIndex).toBe(1);
  }));

  it('should loop depending on attr.loop', inject(function($rootScope) {
    var slideBox = makeSlideBox('<ion-slide-box loop="shouldLoop">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>');

    $rootScope.$apply('shouldLoop = true');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');
    expect(slideBoxCtrl.selected()).toBe(0);
    slideBoxCtrl.select(slideBoxCtrl.previous());
    expect(slideBoxCtrl.selected()).toBe(2);
    slideBoxCtrl.select(slideBoxCtrl.next());
    expect(slideBoxCtrl.selected()).toBe(0);

    // Disable looping
    $rootScope.$apply('shouldLoop = false');

    // No loop at previous boundary
    expect(slideBoxCtrl.selected()).toBe(0);
    slideBoxCtrl.select(slideBoxCtrl.previous());
    expect(slideBoxCtrl.selected()).toBe(0);

    // No loop at next boundary
    slideBoxCtrl.select(2);
    expect(slideBoxCtrl.selected()).toBe(2);
    slideBoxCtrl.select(slideBoxCtrl.next());
    expect(slideBoxCtrl.selected()).toBe(2);
  }));

  it('should autoplay depending on attr.autoPlay', inject(function($rootScope, $interval) {
    var slideBox = makeSlideBox('<ion-slide-box loop="shouldLoop" auto-play="playInterval">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>');

    $rootScope.$apply('shouldLoop = false; playInterval = 1000;');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');
    expect(slideBoxCtrl.selected()).toBe(0);
    $interval.flush(1000);
    expect(slideBoxCtrl.selected()).toBe(1);
    $interval.flush(1000);
    expect(slideBoxCtrl.selected()).toBe(2);
    // Should not go beyond limit with loop disabled
    $interval.flush(1000);
    expect(slideBoxCtrl.selected()).toBe(2);

    // Should loop
    $rootScope.$apply('shouldLoop = true');
    $interval.flush(1000);
    expect(slideBoxCtrl.selected()).toBe(0);

    // Should deactivate and stop looping
    $rootScope.$apply('playInterval = -1');
    $interval.flush();
    expect(slideBoxCtrl.selected()).toBe(0);
  }));

  it('should call onSlideChanged', inject(function($rootScope, $timeout) {
    $rootScope.changed = jasmine.createSpy('slideChanged');
    var el = makeSlideBox('<ion-slide-box on-slide-changed="changed($slideIndex)">' +
                    '<ion-slide>A</ion-slide>' +
                    '<ion-slide>B</ion-slide>' +
                    '<ion-slide>C</ion-slide>' +
                '</ion-slide-box>');

    $rootScope.$apply();
    var slideBoxCtrl = el.controller('ionSlideBox');
    $timeout.flush();
    expect($rootScope.changed).toHaveBeenCalledWith(0);

    slideBoxCtrl.select(1);
    $rootScope.$apply();
    expect($rootScope.changed).toHaveBeenCalledWith(1);
  }));
});
