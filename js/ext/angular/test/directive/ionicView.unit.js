'use strict';

describe('Ionic View', function() {
  var compile, scope, listElement, listCtrl;

  beforeEach(module('ionic.ui.viewState'));

  beforeEach(inject(function($compile, $rootScope, $controller) {
    compile = $compile;
    scope = $rootScope;
  }));

  it('should init a view', function() {
    var element = compile('<ion-view>me view</ion-view>')(scope);
    expect(element.html()).toEqual('me view');
  });

  it('should add pane classname and remove title from view', function() {
    var element = compile('<ion-view title="\'Me Title\'"></ion-view>')(scope);
    expect(element.attr('title')).toBeUndefined();
    expect(element.hasClass('pane')).toEqual(true);
  });

  it('should broacast view enter on link', function() {
    spyOn(scope, '$broadcast');
    var element = compile('<ion-view title="\'Me Title\'"></ion-view>')(scope);
    expect(scope.$broadcast).toHaveBeenCalledWith('viewState.viewEnter', { title: 'Me Title', navDirection: undefined });

    scope.$navDirection = 'forward';
    element = compile('<ion-view title="\'Me Title\'"></ion-view>')(scope);
    expect(scope.$broadcast).toHaveBeenCalledWith('viewState.viewEnter', { title: 'Me Title', navDirection: 'forward' });
  });

  it('should set hide back button', function() {
    spyOn(scope, '$broadcast');

    var element = compile('<ion-view></ion-view>')(scope);
    var viewScope = element.isolateScope();
    expect(viewScope.hideBackButton).toBeUndefined();
    expect(scope.$broadcast).not.toHaveBeenCalledWith('viewState.showBackButton', false);

    element = compile('<ion-view hide-back-button="true"></ion-view>')(scope);
    viewScope = element.isolateScope();
    expect(viewScope.hideBackButton).toEqual(true);
    expect(scope.$broadcast).toHaveBeenCalledWith('viewState.showBackButton', false);
  });

  it('should add/remove back button based on events', function() {
    var element = compile('<ion-nav-bar back-button-label="Back"></ion-nav-bar>')(scope);
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
    var element = compile('<ion-nav-bar></ion-nav-bar>')(scope);
    scope.$digest();
    expect(element.hasClass('invisible')).toEqual(true);
    scope.$broadcast('viewState.showNavBar', true);
    scope.$digest();
    expect(element.hasClass('invisible')).toEqual(false);
    scope.$broadcast('viewState.showNavBar', false);
    scope.$digest();
    expect(element.hasClass('invisible')).toEqual(true);
  });

  it('should have have animateEnabled=true if there is a navDirection and animate isnt false', function() {
    var element = compile('<ion-nav-bar></ion-nav-bar>')(scope);
    scope.$digest();
    scope = element.isolateScope();

    scope.$broadcast('viewState.viewEnter', {});
    expect(scope.animateEnabled).toBe(false);

    scope.$broadcast('viewState.viewEnter', { navDirection: 'forward' });
    expect(scope.animateEnabled).toBe(true);

    scope.$broadcast('viewState.viewEnter', { navDirection: 'forward', animate: false });
    expect(scope.animateEnabled).toBe(false);

    scope.$broadcast('viewState.viewEnter', { navDirection: 'back', animate: true });
    expect(scope.animateEnabled).toBe(true);
  });

  it('should hide navBar when using view attr', function() {
    var element = compile('<div><ion-nav-bar></ion-nav-bar><ion-view hide-nav-bar="true"></ion-view></div>')(scope);
    scope.$digest();
    var navBar = element.find('header')
    expect(navBar.hasClass('invisible')).toEqual(true);
  });

  it('should show and update navBar title when using view attr or events', function() {
    scope.viewTitle = 'Title';
    var element = compile('<div><ion-nav-bar></ion-nav-bar><ion-view title="viewTitle"></ion-view></div>')(scope);
    scope.$digest();
    var navBar = element.find('header');
    var title = navBar.find('h1');
    expect(title.text().trim()).toEqual('Title');

    scope.viewTitle = 'New Title';
    scope.$digest();
    title = navBar.find('h1');
    expect(title.text().trim()).toEqual('New Title');

    scope.$broadcast('viewState.titleUpdated', { title: 'Event Title' });
    scope.$digest();
    title = navBar.find('h1');
    expect(title.text().trim()).toEqual('Event Title');
  });

  it('should show / update navBar left and right buttons when using view attr or events', function() {
    scope.leftButtons = [{
      type: 'button',
      content: 'Left Button'
    }];
    scope.rightButtons = [{
      type: 'button',
      content: 'Right Button'
    }];
    var element = compile('<div><ion-nav-bar></ion-nav-bar><ion-view left-buttons="leftButtons" right-buttons="rightButtons"></ion-view></div>')(scope);
    scope.$digest();

    var leftButton = angular.element(element[0].querySelector('.left-buttons')).find('button');
    expect(leftButton.text().trim()).toBe('Left Button');
    var rightButton = angular.element(element[0].querySelector('.right-buttons')).find('button');
    expect(rightButton.text().trim()).toBe('Right Button');

    scope.leftButtons = [{
      type: 'button',
      content: 'New Left Button'
    }];
    scope.rightButtons = [{
      type: 'button',
      content: 'New Right Button'
    }];

    scope.$digest();

    leftButton = angular.element(element[0].querySelector('.left-buttons')).find('button');
    expect(leftButton.text().trim()).toBe('New Left Button');
    rightButton = angular.element(element[0].querySelector('.right-buttons')).find('button');
    expect(rightButton.text().trim()).toBe('New Right Button');

    scope.$broadcast('viewState.leftButtonsChanged', [{
      type: 'button',
      content: 'Event Left Button'
    }]);
    scope.$broadcast('viewState.rightButtonsChanged', [{
      type: 'button',
      content: 'Event Right Button'
    }]);

    scope.$digest();

    leftButton = angular.element(element[0].querySelector('.left-buttons')).find('button');
    expect(leftButton.text().trim()).toBe('Event Left Button');
    rightButton = angular.element(element[0].querySelector('.right-buttons')).find('button');
    expect(rightButton.text().trim()).toBe('Event Right Button');
  });

  it('should show navbar when not using view attr', function() {
    var element = compile('<div><ion-nav-bar></ion-nav-bar><ion-view></ion-view></div>')(scope);
    scope.$digest();
    var navBar = element.find('header')
    expect(navBar.hasClass('invisible')).toEqual(false);
  });

  it('should set the navBar type', function() {
    var element = compile('<ion-nav-bar type="bar-positive"></ion-nav-bar>')(scope);
    scope.$digest();
    expect(element.hasClass('bar-positive')).toEqual(true);
  });

  it('should not have the back button if no back button attributes set', function() {
    var element = compile('<ion-nav-bar></ion-nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(0);
  });

  it('should have the back button if back-button-type attributes set', function() {
    var element = compile('<ion-nav-bar back-button-type="button-icon"></ion-nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if back-button-icon attributes set', function() {
    var element = compile('<ion-nav-bar back-button-icon="ion-back"></ion-nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if back-button-label attributes set', function() {
    var element = compile('<ion-nav-bar back-button-label="Button"></ion-nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should have the back button if all back button attributes set', function() {
    var element = compile('<ion-nav-bar back-button-type="button-icon" back-button-icon="ion-back" back-button-label="Button"></ion-nav-bar>')(scope);
    scope.$digest();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.length).toEqual(1);
  });

  it('should set just a back button icon, no text', function() {
    var element = compile('<ion-nav-bar back-button-icon="ion-back" back-button-type="button-icon"></ion-nav-bar>')(scope);
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
    var element = compile('<ion-nav-bar back-button-label="Back" back-button-type="button-clear"></ion-nav-bar>')(scope);
    scope.$apply();
    var backButton = angular.element(element[0].querySelector('.back-button'));
    expect(backButton.hasClass('button')).toEqual(true);
    expect(backButton.hasClass('button-clear')).toEqual(true);
    expect(backButton.hasClass('icon')).toEqual(false);
    expect(backButton.text().trim()).toEqual('Back');
  });

  it('should set a back button with an icon and text, button-icon', function() {
    var element = compile('<ion-nav-bar back-button-icon="ion-back" back-button-label="Back" back-button-type="button-icon"></ion-nav-bar>')(scope);
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

