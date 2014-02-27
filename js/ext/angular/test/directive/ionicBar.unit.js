describe('Ionic Header Bar', function() {
  var el, rootScope, compile;

  beforeEach(module('ionic'));

  beforeEach(inject(function($compile, $rootScope) {
    compile = $compile;
    rootScope = $rootScope;
  }));

  it('Should not add title-left or title-right classes when align-title=center', function() {
    runs(function(){
      el = compile('<ion-header-bar align-title="center"></ion-header-bar>')(rootScope);
    });

    //wait for headerBar View to align() the title
    waits(500);

    runs(function(){
      var headerView = el.isolateScope().headerBarView;
      var title = angular.element(headerView.el.querySelector('.title'));
      expect(title.hasClass('title-left')).not.toEqual(true);
      expect(title.hasClass('title-right')).not.toEqual(true);
    });
  });

  it('Should add title-left class when align-title=left', function() {
    runs(function(){
      el = compile('<ion-header-bar align-title="left"></ion-header-bar>')(rootScope);
    });

    //wait for headerBar View to align() the title
    waits(500);

    runs(function(){
      var headerView = el.isolateScope().headerBarView;
      var title = angular.element(headerView.el.querySelector('.title'));
      expect(title.hasClass('title-left')).toEqual(true);
    });
  });

  it('Should add title-right class when align-title=right', function() {
    runs(function(){
      el = compile('<ion-header-bar align-title="right"></ion-header-bar>')(rootScope);
    });

    //wait for headerBar View to align() the title
    waits(500);

    runs(function(){
      var headerView = el.isolateScope().headerBarView;
      var title = angular.element(headerView.el.querySelector('.title'));
      expect(title.hasClass('title-right')).toEqual(true);
    });
  });

});
