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

  it('should set the navBar type', function() {
    var element = compile('<nav-bar type="bar-positive"></nav-bar>')(scope);
    scope.$digest();
    expect(element.hasClass('bar-positive')).toEqual(true);
  });

  it('should not have the back button if no back button attributes set', function() {
    var element = compile('<nav-bar></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.length).toEqual(0);
  });

  it('should have the back button if back-button-type attributes set', function() {
    var element = compile('<nav-bar back-button-type="button-icon"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if back-button-icon attributes set', function() {
    var element = compile('<nav-bar back-button-icon="ion-back"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if back-button-label attributes set', function() {
    var element = compile('<nav-bar back-button-label="Button"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if all back button attributes set', function() {
    var element = compile('<nav-bar back-button-type="button-icon" back-button-icon="ion-back" back-button-label="Button"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.length).toEqual(1);
  });

  it('should set just a back button icon, no text', function() {
    var element = compile('<nav-bar back-button-icon="ion-back" back-button-type="button-icon"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-icon')).toEqual(true);
    expect(backButton.hasClass('icon')).toEqual(true);
    expect(backButton.hasClass('ion-back')).toEqual(true);
    expect(backButton.html()).toEqual('');
  });

  it('should set just a back button with only text, button-clear', function() {
    var element = compile('<nav-bar back-button-label="Back" back-button-type="button-clear"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-clear')).toEqual(true);
    expect(backButton.hasClass('icon')).toEqual(false);
    expect(backButton.html()).toEqual('Back');
  });

  it('should set a back button with an icon and text, button-icon', function() {
    var element = compile('<nav-bar back-button-icon="ion-back" back-button-label="Back" back-button-type="button-icon"></nav-bar>')(scope);
    scope.$digest();
    var backButton = element.find('div').find('button');
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-icon')).toEqual(true);
    var icon = backButton.find('i');
    expect(icon.hasClass('icon')).toEqual(true);
    expect(backButton.html()).toEqual('<i class="icon ion-back"></i> Back');
  });

});

