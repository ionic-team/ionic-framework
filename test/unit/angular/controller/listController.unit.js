describe('$ionicList controller', function() {
  beforeEach(module('ionic'));
  function setup(attrs) {
    var ctrl;
    inject(function($controller, $rootScope) {
      var scope = $rootScope.$new();
      ctrl = $controller('$ionicList', {
        $scope: scope,
        $attrs: attrs || {},
      });
      ctrl.$scope = scope;
    });
    return ctrl;
  }

  it('should register with handle', inject(function($ionicListDelegate) {
    spyOn($ionicListDelegate, '_registerInstance');
    var ctrl = setup({delegateHandle: 'foobar'});
    expect($ionicListDelegate._registerInstance)
      .toHaveBeenCalledWith(ctrl, 'foobar', jasmine.any(Function));
  }));

  it('should register with given handle and deregister on destroy', inject(function($ionicListDelegate) {
    var deregisterSpy = jasmine.createSpy('deregister');
    spyOn($ionicListDelegate, '_registerInstance').andCallFake(function() {
      return deregisterSpy;
    });
    var ctrl = setup({
      delegateHandle: 'something'
    });
    expect($ionicListDelegate._registerInstance)
      .toHaveBeenCalledWith(ctrl, 'something', jasmine.any(Function));

    expect(deregisterSpy).not.toHaveBeenCalled();
    ctrl.$scope.$destroy();
    expect(deregisterSpy).toHaveBeenCalled();
  }));

  it('.showReorder sets/gets', function() {
    var ctrl = setup();
    expect(ctrl.showReorder()).toBe(false);
    ctrl.showReorder(true);
    expect(ctrl.showReorder()).toBe(true);
  });

  it('.showDelete sets/gets', function() {
    var ctrl = setup();
    expect(ctrl.showDelete()).toBe(false);
    ctrl.showDelete(true);
    expect(ctrl.showDelete()).toBe(true);
  });

  it('.canSwipeItems sets/gets', function() {
    var ctrl = setup();
    expect(ctrl.canSwipeItems()).toBe(true);
    ctrl.canSwipeItems(false);
    expect(ctrl.canSwipeItems()).toBe(false);
  });

  it('.closeOptionButtons closes calls clearDragEffects', function() {
    var ctrl = setup();
    ctrl.listView = { clearDragEffects: jasmine.createSpy('clearDragEffects') };
    ctrl.closeOptionButtons();
    expect(ctrl.listView.clearDragEffects).toHaveBeenCalled();
  });
});

