import type { Config } from '../../../interface';
import { startTapClick } from '../index';

// https://github.com/ionic-team/ionic-framework/issues/22491
describe('tap click utility', () => {
  beforeEach(() => {
    startTapClick({
      getBoolean: () => true,
    } as unknown as Config);
  });

  afterEach(() => {
    document.dispatchEvent(new Event('pointerup', { bubbles: true }));
    document.body.innerHTML = '';
  });

  it('preserves the active state when the captured gesture element matches', () => {
    const button = createActivatableElement();

    activate(button);
    captureGesture(button);

    expect(button.classList.contains('ion-activated')).toBe(true);
  });

  it('preserves the active state when the captured gesture element is a descendant', () => {
    const button = createActivatableElement();
    const child = document.createElement('span');
    button.append(child);

    activate(child);
    captureGesture(child);

    expect(button.classList.contains('ion-activated')).toBe(true);
  });

  it('removes a captured ripple when a mouse drag starts', async () => {
    const button = createActivatableElement();
    const ripple = document.createElement('ion-ripple-effect');
    const remove = jest.fn();
    ripple.addRipple = jest.fn().mockResolvedValue(remove);
    button.append(ripple);
    activate(button);
    captureGesture(button);
    expect(ripple.addRipple).toHaveBeenCalledTimes(1);
    button.dispatchEvent(pointerEvent('pointermove', 20, 10));
    await Promise.resolve();
    expect(remove).toHaveBeenCalledTimes(1);
    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('cancels a gesture captured after the pointer has already moved', () => {
    const button = createActivatableElement();
    activate(button);
    button.dispatchEvent(pointerEvent('pointermove', 20, 10));
    captureGesture(button);
    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('cancels activation when an ancestor captures a gesture', () => {
    const button = createActivatableElement();
    activate(button);
    captureGesture(document.body);
    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('cancels the active state when the captured gesture element is unrelated', () => {
    const button = createActivatableElement();
    const unrelatedElement = document.createElement('div');
    document.body.append(unrelatedElement);

    activate(button);
    captureGesture(unrelatedElement);

    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('cancels the active state when the captured gesture element is missing', () => {
    const button = createActivatableElement();

    activate(button);
    captureGesture();

    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('cancels the active state on pointercancel', () => {
    const button = createActivatableElement();

    activate(button);
    document.dispatchEvent(new Event('pointercancel', { bubbles: true }));

    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('clears the active state on pointerup', () => {
    const button = createActivatableElement();

    activate(button);
    document.dispatchEvent(new Event('pointerup', { bubbles: true }));

    expect(button.classList.contains('ion-activated')).toBe(false);
  });
});

const createActivatableElement = () => {
  const button = document.createElement('button');
  button.classList.add('ion-activatable', 'ion-activatable-instant');
  document.body.append(button);
  return button;
};

const activate = (element: HTMLElement) => {
  element.dispatchEvent(pointerEvent('pointerdown', 10, 10));
  expect(element.closest('.ion-activatable')?.classList.contains('ion-activated')).toBe(true);
};

const captureGesture = (gestureElement?: Node) => {
  document.dispatchEvent(
    new CustomEvent('ionGestureCaptured', {
      detail: { gestureName: 'test', gestureElement },
    })
  );
};

// Stencil's MouseEvent mock does not derive page coordinates from client coordinates.
const pointerEvent = (type: string, x: number, y: number) => {
  const event = new MouseEvent(type, { bubbles: true, composed: true, button: 0, clientX: x, clientY: y });
  Object.defineProperties(event, { pageX: { value: x }, pageY: { value: y } });
  return event;
};
