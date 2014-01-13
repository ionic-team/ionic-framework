'use strict';

describe('Ionic View', function() {
  var compile, scope, listElement, listCtrl;

  beforeEach(module('ionic.ui.viewState'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('should init a view', function() {
    var element = compile('<view>me view</view>')(scope);
    expect(element.html()).toEqual('me view');
  });

  it('should add pane classname and remove title from view', function() {
    var element = compile('<view title="\'Me Title\'"></view>')(scope);
    expect(element.attr('title')).toBeUndefined();
    expect(element.hasClass('pane')).toEqual(true);
  });

  it('should broacast view enter on link', function() {
    spyOn(scope, '$broadcast');
    var element = compile('<view title="\'Me Title\'"></view>')(scope);
    expect(scope.$broadcast).toHaveBeenCalledWith('viewState.viewEnter', { title: 'Me Title', navDirection: undefined });

    scope.$navDirection = 'forward';
    element = compile('<view title="\'Me Title\'"></view>')(scope);
    expect(scope.$broadcast).toHaveBeenCalledWith('viewState.viewEnter', { title: 'Me Title', navDirection: 'forward' });
  });

  it('should set hide back button', function() {
    spyOn(scope, '$broadcast');

    var element = compile('<view></view>')(scope);
    var viewScope = element.isolateScope();
    expect(viewScope.hideBackButton).toBeUndefined();
    expect(scope.$broadcast).not.toHaveBeenCalledWith('viewState.showBackButton', false);

    element = compile('<view hide-back-button="true"></view>')(scope);
    viewScope = element.isolateScope();
    expect(viewScope.hideBackButton).toEqual(true);
    expect(scope.$broadcast).toHaveBeenCalledWith('viewState.showBackButton', false);
  });

  it('should show/hide viewBack', function() {
    var element = compile('<button view-back>BUTTON</button>')(scope);
    expect(element.hasClass('hide')).toEqual(true);
    scope.$broadcast('viewState.showBackButton', true);
    expect(element.hasClass('hide')).toEqual(false);
    scope.$broadcast('$viewHistory.historyChange', { showBack: false });
    expect(element.hasClass('hide')).toEqual(true);
  });

  it('should show/hide navBar', function() {
    var element = compile('<nav-bar></nav-bar>')(scope);
    expect(element.hasClass('invisible')).toEqual(true);
    scope.$broadcast('viewState.showNavBar', true);
    scope.$digest();
    expect(element.hasClass('invisible')).toEqual(false);
    scope.$broadcast('viewState.showNavBar', false);
    scope.$digest();
    expect(element.hasClass('invisible')).toEqual(true);
  });

  it('should hide navBar when using view attr', function() {
    var element = compile('<div><nav-bar></nav-bar><view hide-nav-bar="true"></view></div>')(scope);
    scope.$digest();
    var navBar = element.find('header')
    expect(navBar.hasClass('invisible')).toEqual(true);

    element = compile('<div><nav-bar></nav-bar><view></view></div>')(scope);
    scope.$digest();
    navBar = element.find('header')
    expect(navBar.hasClass('invisible')).toEqual(false);
  });

});

