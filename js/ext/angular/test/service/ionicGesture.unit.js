describe('Ionic Gesture Service', function() {
  var gesture;

  beforeEach(module('ionic.service.gesture'));

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

    var event = new CustomEvent('drag', { target: el });
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

    var event = new CustomEvent('drag', { target: el });
    el.dispatchEvent(event);

    expect(handlers.dragHandle).toHaveBeenCalled();

    gesture.off(g, 'drag', handlers.dragHandle);

    event = new CustomEvent('drag', { target: el });
    el.dispatchEvent(event);

    expect(handlers.dragHandle).toHaveBeenCalled();
  });
});
