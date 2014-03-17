describe('ionNavButtons directive', function() {

  beforeEach(module('ionic.ui.navBar'));
  function setup(attrs, contents) {
    var el;
    inject(function($compile, $rootScope) {
      el = angular.element('<ion-nav-buttons ' + (attrs||'') + '>'+(contents||'')+'</ion-nav-buttons>');
      el.data('$ionNavBarController', {
        leftButtonsElement: angular.element('<div>'),
        rightButtonsElement: angular.element('<div>')
      });
      el = $compile(el)($rootScope.$new());
      $rootScope.$apply();
    });
    return el;
  }

  it('should error without parent navBar', inject(function($compile, $rootScope) {
    expect(function() {
      $compile('<ion-nav-buttons>')($rootScope.$new());
    }).toThrow();
  }));

  it('should make the container element end up display:none', function() {
    var el = setup();
    expect(el.css('display')).toBe('none');
  });

  it('should transclude contents into left', function() {
    var el = setup('side="left" ng-init="items=[1,2]"', '<button ng-repeat="i in items">{{i}}</button>');
    var leftButtons = el.controller('ionNavBar').leftButtonsElement.children();
    expect(leftButtons.text().trim()).toEqual('12');
    el.scope().$apply('items=[1,3,5]');
    expect(leftButtons.text().trim()).toEqual('135');
  });

  it('should transclude contents into right', function() {
    var el = setup('side="right" ng-init="items=[1,2]"', '<button ng-repeat="i in items">{{i}}</button>');
    var rightButtons = el.controller('ionNavBar').rightButtonsElement.children();
    expect(rightButtons.text().trim()).toEqual('12');
    el.scope().$apply('items=[1,3,5]');
    expect(rightButtons.text().trim()).toEqual('135');
  });

  it('left should destroy contents on scope destroy', inject(function($animate) {
    spyOn($animate, 'leave');

    var el = setup('side="left" ng-init="items=[1,2]"', '<button ng-repeat="i in items">{{i}}</button>');
    var leftButtons = el.controller('ionNavBar').leftButtonsElement.children();
    expect(leftButtons.text().trim()).toEqual('12');
    el.scope().$destroy();
    expect($animate.leave).toHaveBeenCalled();
    expect($animate.leave.mostRecentCall.args[0][0]).toBe(leftButtons[0]);
  }));

  it('right should destroy contents on scope destroy', inject(function($animate) {
    spyOn($animate, 'leave');

    var el = setup('side="right" ng-init="items=[1,2]"', '<button ng-repeat="i in items">{{i}}</button>');
    var rightButtons = el.controller('ionNavBar').rightButtonsElement.children();
    expect(rightButtons.text().trim()).toEqual('12');
    el.scope().$destroy();
    expect($animate.leave).toHaveBeenCalled();
    expect($animate.leave.mostRecentCall.args[0][0]).toBe(rightButtons[0]);
  }));

});
