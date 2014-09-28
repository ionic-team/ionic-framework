describe('ionSlide directive', function() {
  beforeEach(module('ionic'));

  it('should add and remove itself from parent ctrl', inject(function($compile, $rootScope) {
    var parent = $compile('<ion-slide-box>' +
                          '<ion-slide>Hello</ion-slide>' +
                          '</ion-slide-box>')($rootScope.$new());

    $rootScope.$apply();
    var slide = parent.find('ion-slide');

    var slideBoxCtrl = parent.controller('ionSlideBox');
    var slideCtrl = slide.controller('ionSlide');
    expect(slideBoxCtrl.count()).toBe(1);
    expect(slideBoxCtrl.at(0)).toBe(slideCtrl);

    slide.scope().$broadcast('$destroy');
    expect(slideBoxCtrl.count()).toBe(0);
  }));

});
