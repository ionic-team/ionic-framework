import type { Config } from '../../../interface';
import { startTapClick } from '../index';

let onGestureCaptured: EventListener;
let onPointerDown: EventListener;
let onPointerUp: EventListener;
let onPointerCancel: EventListener;

describe('tap click utility', () => {
  beforeAll(() => {
    const addEventListener = jest.spyOn(document, 'addEventListener');
    startTapClick({
      getBoolean: () => false,
    } as unknown as Config);

    onGestureCaptured = getListener(addEventListener, 'ionGestureCaptured');
    onPointerDown = getListener(addEventListener, 'pointerdown');
    onPointerUp = getListener(addEventListener, 'pointerup');
    onPointerCancel = getListener(addEventListener, 'pointercancel');
    addEventListener.mockRestore();
  });

  afterEach(() => {
    onPointerUp(new Event('pointerup'));
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
    onPointerCancel(new Event('pointercancel'));

    expect(button.classList.contains('ion-activated')).toBe(false);
  });

  it('clears the active state on pointerup', () => {
    const button = createActivatableElement();

    activate(button);
    onPointerUp(new Event('pointerup'));

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
  onPointerDown({
    button: 0,
    target: element,
  } as unknown as PointerEvent);

  const activatableElement = element.closest('.ion-activatable');
  expect(activatableElement?.classList.contains('ion-activated')).toBe(true);
};

const captureGesture = (gestureElement?: Node) => {
  onGestureCaptured(
    new CustomEvent('ionGestureCaptured', {
      detail: { gestureName: 'test', gestureElement },
    })
  );
};

const getListener = (addEventListener: jest.SpyInstance, eventName: string): EventListener => {
  const listener = addEventListener.mock.calls.find(([type]) => type === eventName)?.[1];

  if (typeof listener !== 'function') {
    throw new Error(`Missing ${eventName} listener`);
  }

  return listener;
};
