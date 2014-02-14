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

  it('should add/remove back button based on events', function() {
    var element = compile('<nav-bar back-button-label="Back"></nav-bar>')(scope);
    scope.$apply();
    function backButton() {
      return angular.element(element[0].querySelector('.back-button'));
    };
    expect(backButton().length).toEqual(1);

    scope.$broadcast('viewState.showBackButton', false);
    scope.$apply();
    expect(backButton().length).toEqual(0);

    scope.$broadcast('viewState.showBackButton', true);
    scope.$apply();
    expect(backButton().length).toEqual(1);

    scope.$broadcast('$viewHistory.historyChange', { showBack: false });
    scope.$apply();
    expect(backButton().length).toEqual(0);

    scope.$broadcast('$viewHistory.historyChange', { showBack: true });
    scope.$apply();
    expect(backButton().length).toEqual(1);
  });

  it('should show/hide navBar', function() {
    var element = compile('<nav-bar></nav-bar>')(scope);
    scope.$digest();
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
  });

  it('should show navbar when not using view attr', function() {
    var element = compile('<div><nav-bar></nav-bar><view></view></div>')(scope);
    scope.$digest();
    var navBar = element.find('header')
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
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(0);
  });

  it('should have the back button if back-button-type attributes set', function() {
    var element = compile('<nav-bar back-button-type="button-icon"></nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if back-button-icon attributes set', function() {
    var element = compile('<nav-bar back-button-icon="ion-back"></nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if back-button-label attributes set', function() {
    var element = compile('<nav-bar back-button-label="Button"></nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if all back button attributes set', function() {
    var element = compile('<nav-bar back-button-type="button-icon" back-button-icon="ion-back" back-button-label="Button"></nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should set just a back button icon, no text', function() {
    var element = compile('<nav-bar back-button-icon="ion-back" back-button-type="button-icon"></nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-icon')).toEqual(true);
    expect(backButton.hasClass('icon')).toEqual(true);
    expect(backButton.hasClass('ion-back')).toEqual(true);
    expect(backButton.children().length).toEqual(0);
    expect(backButton.text().trim()).toEqual('');
  });

  it('should set just a back button with only text, button-clear', function() {
    var element = compile('<nav-bar back-button-label="Back" back-button-type="button-clear"></nav-bar>')(scope);
    scope.$apply();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-clear')).toEqual(true);
    expect(backButton.hasClass('icon')).toEqual(false);
    expect(backButton.text().trim()).toEqual('Back');
  });

  it('should set a back button with an icon and text, button-icon', function() {
    var element = compile('<nav-bar back-button-icon="ion-back" back-button-label="Back" back-button-type="button-icon"></nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-icon')).toEqual(true);
    var icon = backButton.find('i');
    expect(icon.hasClass('icon')).toEqual(true);
    expect(backButton.children()[0].tagName.toLowerCase()).toBe('i');
    expect(backButton.children()[0].className).toBe('icon ion-back');
    expect(backButton.text().trim()).toBe('Back');
  });

});

