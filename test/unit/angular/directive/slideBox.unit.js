describe('ionSlideBox directive', function() {
  beforeEach(module('ionic'));
  beforeEach(function() {
    spyOn(ionic, 'requestAnimationFrame').andCallFake(function(cb) { cb(); });
  });

  it('should bind to selected attr', inject(function($compile, $rootScope, $timeout) {
    var slideBox = $compile('<ion-slide-box selected="currentIndex">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>')($rootScope);

    var slideBoxCtrl = slideBox.controller('ionSlideBox');

    expect(slideBoxCtrl.shown()).toBe(0);
    $timeout.flush();
    expect($rootScope.currentIndex).toBe(0);

    $rootScope.$apply('currentIndex = 2');
    expect(slideBoxCtrl.shown()).toBe(2);

    slideBoxCtrl.select(1);
    $timeout.flush();
    expect($rootScope.currentIndex).toBe(1);

    // No out of bounds
    expect(slideBoxCtrl.shown()).toBe(1);
    $rootScope.$apply('currentIndex = -1');
    expect(slideBoxCtrl.shown()).toBe(1);
    $rootScope.$apply('currentIndex = 3');
    expect(slideBoxCtrl.shown()).toBe(1);
  }));

  it('should loop depending on attr.loop', inject(function($compile, $rootScope) {
    var slideBox = $compile('<ion-slide-box loop="shouldLoop">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>')($rootScope);

    $rootScope.$apply('shouldLoop = true');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');
    expect(slideBoxCtrl.shown()).toBe(0);
    slideBoxCtrl.select(slideBoxCtrl.left());
    expect(slideBoxCtrl.shown()).toBe(2);
    slideBoxCtrl.select(slideBoxCtrl.right());
    expect(slideBoxCtrl.shown()).toBe(0);

    // Disable looping
    $rootScope.$apply('shouldLoop = false');

    // No loop at left boundary
    expect(slideBoxCtrl.shown()).toBe(0);
    slideBoxCtrl.select(slideBoxCtrl.left());
    expect(slideBoxCtrl.shown()).toBe(0);

    // No loop at right boundary
    slideBoxCtrl.select(2);
    expect(slideBoxCtrl.shown()).toBe(2);
    slideBoxCtrl.select(slideBoxCtrl.right());
    expect(slideBoxCtrl.shown()).toBe(2);
  }));

  it('should autoplay depending on attr.autoPlay', inject(function($compile, $rootScope, $interval) {
    var slideBox = $compile('<ion-slide-box loop="shouldLoop" auto-play="playInterval">' +
                              '<ion-slide>A</ion-slide>' +
                              '<ion-slide>B</ion-slide>' +
                              '<ion-slide>C</ion-slide>' +
                            '</ion-slide-box>')($rootScope);

    $rootScope.$apply('shouldLoop = false; playInterval = 1000;');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');
    expect(slideBoxCtrl.shown()).toBe(0);
    $interval.flush(1000);
    expect(slideBoxCtrl.shown()).toBe(1);
    $interval.flush(1000);
    expect(slideBoxCtrl.shown()).toBe(2);
    // Should not go beyond limit with loop disabled
    $interval.flush(1000);
    expect(slideBoxCtrl.shown()).toBe(2);

    // Should loop
    $rootScope.$apply('shouldLoop = true');
    $interval.flush(1000);
    expect(slideBoxCtrl.shown()).toBe(0);

    // Should deactivate and stop looping
    $rootScope.$apply('playInterval = -1');
    $interval.flush();
    expect(slideBoxCtrl.shown()).toBe(0);
  }));
});
