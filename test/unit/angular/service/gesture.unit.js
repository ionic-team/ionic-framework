describe('Ionic Gesture Service', function() {
  var gesture;

  beforeEach(module('ionic'));

  beforeEach(inject(function($ionicGesture) {
    gesture = $ionicGesture;
  }));

  it('Should bind', function() {
    var el = document.createElement('div');

    var handlers = {
      dragHandle: function(e) {
      }
    };
    spyOn(handlers, 'dragHandle');
    gesture.on('drag', handlers.dragHandle, angular.element(el));

    var event = new ionic.CustomEvent('drag', { target: el });
    el.dispatchEvent(event);

    expect(handlers.dragHandle).toHaveBeenCalled();
  });
  it('Should unbind', function() {
    var el = document.createElement('div');

    var handlers = {
      dragHandle: function(e) {
      }
    };
    spyOn(handlers, 'dragHandle');

    var g = gesture.on('drag', handlers.dragHandle, angular.element(el));

    var event = new ionic.CustomEvent('drag', { target: el });
    el.dispatchEvent(event);

    expect(handlers.dragHandle).toHaveBeenCalled();

    gesture.off(g, 'drag', handlers.dragHandle);

    event = new ionic.CustomEvent('drag', { target: el });
    el.dispatchEvent(event);

    expect(handlers.dragHandle).toHaveBeenCalled();
  });
});
