import { createGesture } from '../index';

describe('GestureController', () => {
  it('includes the gesture element in the captured event', () => {
    const gestureElement = document.createElement('div');
    const onGestureCaptured = jest.fn();
    const gesture = createGesture({
      el: gestureElement,
      gestureName: 'test',
      threshold: 0,
    });

    document.addEventListener('ionGestureCaptured', onGestureCaptured);

    try {
      gesture.enable();
      gestureElement.dispatchEvent(new Event('touchstart'));

      expect(onGestureCaptured).toHaveBeenCalledTimes(1);
      expect(onGestureCaptured.mock.calls[0][0].detail).toEqual({
        gestureName: 'test',
        gestureElement,
      });
    } finally {
      gesture.destroy();
      document.removeEventListener('ionGestureCaptured', onGestureCaptured);
    }
  });
});
