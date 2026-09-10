import { hasCustomModalDimensions } from './safe-area-utils';

/**
 * The helper resolves `--width` and `--height` through `getComputedStyle`, and
 * measures the wrapper when the height sizes to the content. A spec
 * environment reports no custom properties and a zero rect, so each test
 * states the sizes and the wrapper height it wants.
 */
describe('modal: hasCustomModalDimensions', () => {
  const VIEWPORT_HEIGHT = window.innerHeight;

  let host: HTMLElement;
  let wrapper: HTMLElement;
  let hiddenDuringMeasurement: boolean;
  let originalGetComputedStyle: PropertyDescriptor | undefined;
  let sizes: Record<string, string>;

  const setSize = (width: string, height: string) => {
    sizes = { '--width': width, '--height': height };
  };

  const setWrapperHeight = (height: number) => {
    wrapper.getBoundingClientRect = () => {
      hiddenDuringMeasurement = host.classList.contains('overlay-hidden');
      return { height } as DOMRect;
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
    setWrapperHeight(0);

    /**
     * The mock window exposes `getComputedStyle` as a getter, so it has to be
     * replaced on `globalThis` rather than assigned.
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

  it('should be false when the width spans the viewport', () => {
    setSize('100%', '300px');

    expect(hasCustomModalDimensions(host)).toBe(false);
  });

  it('should be false when the height spans the viewport', () => {
    setSize('300px', '100%');

    expect(hasCustomModalDimensions(host)).toBe(false);
  });

  it('should be true when both axes are a definite size', () => {
    setSize('300px', '200px');

    expect(hasCustomModalDimensions(host)).toBe(true);
  });

  it('should be true when a content sized modal stays clear of the edges', () => {
    setSize('300px', 'fit-content');
    setWrapperHeight(244);

    expect(hasCustomModalDimensions(host)).toBe(true);
  });

  // Overflowing content leaves `--max-height` clamping the modal to the
  // viewport, where it reaches the top and bottom edges.
  it('should be false when a content sized modal fills the viewport', () => {
    setSize('300px', 'fit-content');
    setWrapperHeight(VIEWPORT_HEIGHT);

    expect(hasCustomModalDimensions(host)).toBe(false);
  });

  it('should allow a few pixels of tolerance when comparing to the viewport', () => {
    setSize('300px', 'fit-content');
    setWrapperHeight(VIEWPORT_HEIGHT - 4);

    expect(hasCustomModalDimensions(host)).toBe(false);
  });

  it('should measure the wrapper while it is visible and hide it again', () => {
    setSize('300px', 'fit-content');
    setWrapperHeight(VIEWPORT_HEIGHT);

    hasCustomModalDimensions(host);

    expect(hiddenDuringMeasurement).toBe(false);
    expect(host.classList.contains('overlay-hidden')).toBe(true);
  });

  it('should leave a visible modal visible', () => {
    host.classList.remove('overlay-hidden');
    setSize('300px', 'fit-content');
    setWrapperHeight(244);

    hasCustomModalDimensions(host);

    expect(host.classList.contains('overlay-hidden')).toBe(false);
  });
});
