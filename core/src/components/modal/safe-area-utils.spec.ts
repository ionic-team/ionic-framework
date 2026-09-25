import { getModalCoveredAxes } from './safe-area-utils';

/**
 * Tests `getModalCoveredAxes()` across fullscreen, fixed-size, and
 * content-sized modals. The helper uses computed CSS sizes when both
 * dimensions are fullscreen and measures the rendered wrapper otherwise,
 * so the tests mock both sources of size information as needed.
 */
describe('modal: getModalCoveredAxes', () => {
  const VIEWPORT_WIDTH = window.innerWidth;
  const VIEWPORT_HEIGHT = window.innerHeight;

  let host: HTMLElement;
  let wrapper: HTMLElement;
  let hiddenDuringMeasurement: boolean;
  let originalGetComputedStyle: PropertyDescriptor | undefined;
  let sizes: Record<string, string>;

  const setSize = (width: string, height: string) => {
    sizes = { '--width': width, '--height': height };
  };

  const setWrapperBox = (width: number, height: number) => {
    wrapper.getBoundingClientRect = () => {
      hiddenDuringMeasurement = host.classList.contains('overlay-hidden');
      return { width, height } as DOMRect;
    };
  };

  beforeEach(() => {
    host = document.createElement('ion-modal');
    host.classList.add('overlay-hidden');
    document.body.appendChild(host);

    wrapper = document.createElement('div');
    wrapper.classList.add('modal-wrapper');
    host.attachShadow({ mode: 'open' }).appendChild(wrapper);

    hiddenDuringMeasurement = true;
    setWrapperBox(0, 0);

    /**
     * Replace the mocked `getComputedStyle` getter so tests can control
     * the modal's `--width` and `--height` values.
     */
    sizes = {};
    originalGetComputedStyle = Object.getOwnPropertyDescriptor(globalThis, 'getComputedStyle');
    Object.defineProperty(globalThis, 'getComputedStyle', {
      value: () => ({ getPropertyValue: (property: string) => sizes[property] ?? '' }),
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    if (originalGetComputedStyle) {
      Object.defineProperty(globalThis, 'getComputedStyle', originalGetComputedStyle);
    }
    host.remove();
  });

  it('should cover both axes when the sizes span the viewport', () => {
    setSize('100%', '100%');

    expect(getModalCoveredAxes(host)).toEqual({ vertical: true, horizontal: true });
  });

  it('should cover neither axis for a dialog that stays clear of the viewport edges', () => {
    setSize('300px', '200px');
    setWrapperBox(300, 200);

    expect(getModalCoveredAxes(host)).toEqual({ vertical: false, horizontal: false });
  });

  it('should cover only the horizontal axis for a full-width dialog that fits its content', () => {
    setSize('100%', 'fit-content');
    setWrapperBox(VIEWPORT_WIDTH, 244);

    expect(getModalCoveredAxes(host)).toEqual({ vertical: false, horizontal: true });
  });

  it('should cover only the vertical axis for a narrow modal that fills the viewport', () => {
    setSize('300px', 'fit-content');
    setWrapperBox(300, VIEWPORT_HEIGHT);

    expect(getModalCoveredAxes(host)).toEqual({ vertical: true, horizontal: false });
  });

  it('should cover an axis whose definite size reaches the viewport', () => {
    setSize('300px', `${VIEWPORT_HEIGHT}px`);
    setWrapperBox(300, VIEWPORT_HEIGHT);

    expect(getModalCoveredAxes(host)).toEqual({ vertical: true, horizontal: false });
  });

  it('should allow a few pixels of tolerance when comparing to the viewport', () => {
    setSize('300px', 'fit-content');
    setWrapperBox(300, VIEWPORT_HEIGHT - 4);

    expect(getModalCoveredAxes(host)).toEqual({ vertical: true, horizontal: false });
  });

  it('should temporarily show a hidden modal while measuring and hide it again', () => {
    setSize('300px', 'fit-content');
    setWrapperBox(300, VIEWPORT_HEIGHT);

    getModalCoveredAxes(host);

    expect(hiddenDuringMeasurement).toBe(false);
    expect(host.classList.contains('overlay-hidden')).toBe(true);
  });

  it('should not change visibility when measuring an already visible modal', () => {
    host.classList.remove('overlay-hidden');
    setSize('300px', 'fit-content');
    setWrapperBox(300, 244);

    getModalCoveredAxes(host);

    expect(host.classList.contains('overlay-hidden')).toBe(false);
  });

  it('should not measure when both sizes span the viewport', () => {
    setSize('100%', '100vh');
    setWrapperBox(0, 0);

    expect(getModalCoveredAxes(host)).toEqual({ vertical: true, horizontal: true });
    expect(hiddenDuringMeasurement).toBe(true);
  });
});
