describe('ionModalView directive', function() {
  beforeEach(module('ionic'));

  it('should have class of modal from element', inject(function($rootScope, $compile, $ionicViewService) {
    spyOn($ionicViewService, 'nextViewOptions');
    var el = $compile('<ion-modal-view>')($rootScope.$new());

    expect(el[0].classList.contains('modal')).toBe(true);
  }));

  it('should have class of modal from attribute', inject(function($rootScope, $compile, $ionicViewService) {
    spyOn($ionicViewService, 'nextViewOptions');
    var el = $compile('<div ion-modal-view>')($rootScope.$new());

    expect(el[0].classList.contains('modal')).toBe(true);
  }));

  it('should not have class of modal', inject(function($rootScope, $compile, $ionicViewService) {
    spyOn($ionicViewService, 'nextViewOptions');
    var el = $compile('<div ion-not-modal-view>')($rootScope.$new());

    expect(el[0].classList.contains('modal')).toBe(false);
  }));
  
});
