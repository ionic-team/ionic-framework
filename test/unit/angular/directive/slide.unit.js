describe('ionSlide directive', function() {
  beforeEach(module('ionic'));

  it('should add and remove itself from parent ctrl', inject(function($compile, $rootScope) {
    var parent = $compile('<ion-scroll><ion-slide-box>' +
                          '<ion-slide>Hello</ion-slide>' +
                          '</ion-slide-box></ion-scroll>')($rootScope.$new());

    $rootScope.$apply();
    var slideBox = parent.find('ion-slide-box');
    var slide = slideBox.find('ion-slide');

    var slideBoxCtrl = slideBox.controller('ionSlideBox');
    var slideCtrl = slide.controller('ionSlide');
    expect(slideBoxCtrl.count()).toBe(1);
    expect(slideBoxCtrl.at(0)).toBe(slideCtrl);

    slide.triggerHandler('$destroy');
    expect(slideBoxCtrl.count()).toBe(0);
  }));

});
