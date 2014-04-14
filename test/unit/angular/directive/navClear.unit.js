describe('navClear directive', function() {
  beforeEach(module('ionic'));

  it('should call nextViewOptions on click & stateChangeSuccess', inject(function($rootScope, $compile, $ionicViewService) {
    spyOn($ionicViewService, 'nextViewOptions');
    var el = $compile('<div nav-clear>')($rootScope.$new());

    expect($ionicViewService.nextViewOptions).not.toHaveBeenCalled();
    el.triggerHandler('click');
    el.scope().$broadcast('$stateChangeStart');
    expect($ionicViewService.nextViewOptions).toHaveBeenCalled();
    expect($ionicViewService.nextViewOptions.mostRecentCall.args[0]).toEqual({
      disableAnimate: true,
      disableBack: true
    });
  }));
});
