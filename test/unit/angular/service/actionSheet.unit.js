describe('Ionic ActionSheet Service', function() {

  var sheet, timeout, ionicPlatform;

  beforeEach(module('ionic', function($provide) {
    // For the sake of this test, we don't want ionActionSheet to
    // actually compile as a directive.
    // We are only testing the service.
    $provide.value('ionActionSheetDirective', []);
  }));

  function setup(options) {
    var scope;
    inject(function($ionicActionSheet, $ionicPlatform, $timeout) {
      var hide = $ionicActionSheet.show(options || {});
      $timeout.flush();
      scope = hide.$scope;
    });
    return scope;
  }

  it('should add classes on showing', inject(function($document) {
    var scope = setup();
    expect($document[0].body.classList.contains('action-sheet-open')).toBe(true);
    expect(scope.element.hasClass('active')).toBe(true);
  }));

  it('removeSheet should remove classes, remove element and destroy scope', inject(function($document, $timeout, $animate, $q, $rootScope) {
    // $q.flush();
    var scope = setup();
    spyOn(scope, '$destroy');
    spyOn(scope.element, 'remove');
    scope.removeSheet();
    $timeout.flush();
    $q.flush();
    expect($document[0].body.classList.contains('action-sheet-open')).toBe(false);
    expect(scope.element.hasClass('active')).toBe(false);
    //Naughty, but ngAnimate can't be flushed ATM
    $timeout(function() {
      expect(scope.$destroy).toHaveBeenCalled();
      expect(scope.element.remove).toHaveBeenCalled();
    });
  }));

  it('destructiveButtonClicked should removeSheet if returning true', function() {
    var destructiveReturnValue = false;
    var scope = setup({
      destructiveButtonClicked: function() {
        return destructiveReturnValue;
      }
    });
    spyOn(scope, 'removeSheet');
    scope.destructiveButtonClicked();
    expect(scope.removeSheet).not.toHaveBeenCalled();
    destructiveReturnValue = true;
    scope.destructiveButtonClicked();
    expect(scope.removeSheet).toHaveBeenCalled();
  });

  it('buttonClicked should removeSheet if returning true for index', function() {
    var scope = setup({
      buttons: [{}, {}],
      buttonClicked: function(index) {
        return index === 0 ? false : true;
      }
    });
    spyOn(scope, 'removeSheet');
    scope.buttonClicked(0);
    expect(scope.removeSheet).not.toHaveBeenCalled();
    scope.buttonClicked(1);
    expect(scope.removeSheet).toHaveBeenCalled();
  });

  it('cancel should removeSheet and call opts.cancel', inject(function($timeout, $animate, $q) {
    var d = $q.defer();
    spyOn($animate, 'removeClass').andCallFake(function(el, cls) {
      el.removeClass(cls);
      return d.promise;
    });
    d.resolve();
    $q.flush();
    var cancelSpy = jasmine.createSpy('opts.cancel');
    var scope = setup({
      cancel: cancelSpy
    });
    spyOn(scope, 'removeSheet').andCallThrough();
    scope.cancel();
    $q.flush();
    expect(scope.removeSheet).toHaveBeenCalled();
    expect(cancelSpy).toHaveBeenCalled();
  }));

  it('should cancelOnStateChange by default', inject(function($rootScope) {
    var scope = setup();
    spyOn(scope, 'cancel');
    $rootScope.$broadcast('$stateChangeSuccess');
    expect(scope.cancel).toHaveBeenCalled();
  }));

  it('should not cancelOnStateChange with option as false', inject(function($rootScope) {
    var scope = setup({
      cancelOnStateChange: false
    });
    spyOn(scope, 'cancel');
    $rootScope.$broadcast('$stateChangeSuccess');
    expect(scope.cancel).not.toHaveBeenCalled();
  }));

  it('should add css class to element from cssClass option', inject(function($rootScope) {
    var scope = setup({
      cssClass: 'custom-class'
    });
    scope.showSheet();
    expect(scope.element.hasClass('custom-class')).toBe(true);
  }));

});
