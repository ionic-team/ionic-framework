describe('<ion-slide-pager> directive', function() {
  beforeEach(module('ionic'));

  it('should create pager elements', inject(function($compile, $rootScope, $timeout) {
    var el = $compile('<ion-slide-box>' +
                        '<ion-slide>A</ion-slide>' +
                        '<ion-slide>B</ion-slide>' +
                        '<ion-slide ng-if="showThird">C</ion-slide>' +
                        '<ion-slide-pager></ion-slide-pager>' +
                      '</ion-slide-box>')($rootScope);
    $rootScope.$apply();
    var pager = el.find('ion-slide-pager');

    expect(pager.find('.slider-pager-page').length).toBe(2);

    $rootScope.$apply('showThird = true');
    expect(pager.find('.slider-pager-page').length).toBe(3);

    $rootScope.$apply('showThird = false');
    $timeout.flush();
    expect(pager.find('.slider-pager-page').length).toBe(2);
    
  }));

  it('should by default select on click', inject(function($compile, $rootScope, $timeout) {
    var el = $compile('<ion-slide-box>' +
                        '<ion-slide>A</ion-slide>' +
                        '<ion-slide>B</ion-slide>' +
                        '<ion-slide>C</ion-slide>' +
                        '<ion-slide-pager></ion-slide-pager>' +
                      '</ion-slide-box>')($rootScope);
    $rootScope.$apply();
    var slideBoxCtrl = el.controller('ionSlideBox');
    var pagers = el.find('.slider-pager-page');

    expect(slideBoxCtrl.selected()).toBe(0);
    pagers.eq(1).click();
    expect(slideBoxCtrl.selected()).toBe(1);

    pagers.eq(2).click();
    expect(slideBoxCtrl.selected()).toBe(2);
    
  }));

  it('should allow custom click action which overrides default', inject(function($compile, $rootScope, $timeout) {
    $rootScope.click = jasmine.createSpy('pagerClick');
    var el = $compile('<ion-slide-box>' +
                        '<ion-slide>A</ion-slide>' +
                        '<ion-slide>B</ion-slide>' +
                        '<ion-slide>C</ion-slide>' +
                        '<ion-slide-pager ng-click="click($slideIndex)"></ion-slide-pager>' +
                      '</ion-slide-box>')($rootScope);
    $rootScope.$apply();
    var slideBoxCtrl = el.controller('ionSlideBox');
    var pagers = el.find('.slider-pager-page');

    expect(slideBoxCtrl.selected()).toBe(0);
    pagers.eq(1).click();
    expect(slideBoxCtrl.selected()).toBe(0);
    expect($rootScope.click).toHaveBeenCalledWith(1);

    pagers.eq(2).click();
    expect(slideBoxCtrl.selected()).toBe(0);
    expect($rootScope.click).toHaveBeenCalledWith(2);
    
  }));

});
