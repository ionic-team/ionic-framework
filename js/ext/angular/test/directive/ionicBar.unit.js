describe('Ionic Header Bar', function() {
  var el, rootScope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($animate, $compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
    ionic.requestAnimationFrame = function(cb) { cb(); };
    $animate.enabled(false);
    el = null;
  }));

  it('Should not add title-left or title-right classes when align-title=center', function() {
    el = compile('<ion-header-bar align-title="center"></ion-header-bar>')(rootScope);
    var headerView = el.isolateScope().headerBarView;
    var title = angular.element(headerView.el.querySelector('.title'));
    expect(title.hasClass('title-left')).not.toEqual(true);
    expect(title.hasClass('title-right')).not.toEqual(true);
  });

  it('Should add title-left class when align-title=left', inject(function($animate) {
    el = compile('<ion-header-bar align-title="left"></ion-header-bar>')(rootScope);
    rootScope.$apply();
    var headerView = el.isolateScope().headerBarView;
    var title = angular.element(headerView.el.querySelector('.title'));
    expect(title.hasClass('title-left')).toEqual(true);
  }));

  it('Should add title-right class when align-title=right', function() {
    el = compile('<ion-header-bar align-title="right"></ion-header-bar>')(rootScope);
    rootScope.$apply();
    var headerView = el.isolateScope().headerBarView;
    var title = angular.element(headerView.el.querySelector('.title'));
    expect(title.hasClass('title-right')).toEqual(true);
  });

  it('Should re-align the title when leftButtons change', function() {
    rootScope.leftButtons = [];
    el = compile('<ion-header-bar left-buttons="leftButtons" align-title="right"></ion-header-bar>')(rootScope);
    var headerView = el.isolateScope().headerBarView;

    //trigger initial align()
    rootScope.$apply();

    spyOn(headerView, 'align');

    var button = { content: '<i class="icon ion-gear-a"></i>' };
    rootScope.leftButtons.push(button);
    rootScope.$apply();

    expect(headerView.align).toHaveBeenCalled();
  });

    it('Should re-align the title when rightButtons change', function() {
    rootScope.rightButtons = [];
    el = compile('<ion-header-bar right-buttons="rightButtons" align-title="right"></ion-header-bar>')(rootScope);
    var headerView = el.isolateScope().headerBarView;

    //trigger initial align()
    rootScope.$apply();

    spyOn(headerView, 'align');

    var button = { content: '<i class="icon ion-gear-a"></i>' };
    rootScope.rightButtons.push(button);
    rootScope.$apply();

    expect(headerView.align).toHaveBeenCalled();
  });



});
