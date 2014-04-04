describe('navClear directive', function() {
  beforeEach(module('ionic'));
  it('should call nextViewOptions on click', inject(function($rootScope, $compile, $ionicViewService) {
    spyOn($ionicViewService, 'nextViewOptions');
    var el = $compile('<div nav-clear>')($rootScope.$new());
    expect($ionicViewService.nextViewOptions).not.toHaveBeenCalled();
    el.triggerHandler('click');
    expect($ionicViewService.nextViewOptions).toHaveBeenCalled();
    expect($ionicViewService.nextViewOptions.mostRecentCall.args[0]).toEqual({
      disableAnimate: true,
      disableBack: true
    });
  }));

  it('should run its click action before ngClick', inject(function($rootScope, $compile, $ionicViewService) {
    spyOn($ionicViewService, 'nextViewOptions');
    var el = $compile('<div nav-clear ng-click="method()">')($rootScope.$new());
    var done = false;

    //navClear should've called nextViewOptions by the time the ngClick handler runs
    el.scope().method = function() {
      expect($ionicViewService.nextViewOptions).toHaveBeenCalled();
      done = true;
    };
    el.triggerHandler('click');
    expect(done).toBe(true);
  }));
});
