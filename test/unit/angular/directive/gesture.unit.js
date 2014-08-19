describe('gesture directive', function() {
  beforeEach(module('ionic'));

  GESTURE_DIRECTIVES
  .map(function(directiveName) {
    return {
      gestureName: directiveName.substr(2).toLowerCase(),
      directiveName: directiveName,
      htmlName: directiveName.replace(/[A-Z]/g, function(match, i) {
        return '-' + match.toLowerCase();
      })
    };
  })
  .forEach(function(directive){
    it('should compile', inject(function($compile, $rootScope, $ionicGesture) {
      var fakeGesture = {};
      spyOn($ionicGesture, 'on').andCallFake(function(eventType, listener, el) {
        callback = listener;
        return fakeGesture;
      });
      spyOn($ionicGesture, 'off');
      var el = $compile('<div ' + directive.htmlName + '="foo(1, $event)">')($rootScope.$new());
      $rootScope.$apply();

      el.scope().foo = jasmine.createSpy('foo');

      expect($ionicGesture.on.mostRecentCall.args[0]).toBe(directive.gestureName);
      var event = {};
      callback(event);
      expect(el.scope().foo).toHaveBeenCalledWith(1, event);
      el.scope().$destroy();
      expect($ionicGesture.off).toHaveBeenCalledWith(fakeGesture, directive.gestureName, callback);
    }));
  });
});
