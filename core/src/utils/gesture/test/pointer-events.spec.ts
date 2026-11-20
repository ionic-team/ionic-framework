import { createPointerEvents } from '../pointer-events';

describe('createPointerEvents', () => {
  it('should not add listeners when enabled after being destroyed', () => {
    const el = document.createElement('div');
    const pointerEvents = createPointerEvents(el, () => true, undefined, undefined, { passive: true });

    pointerEvents.enable(true);
    pointerEvents.destroy();

    const addEventListenerSpy = jest.spyOn(el, 'addEventListener');
    pointerEvents.enable(true);

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
