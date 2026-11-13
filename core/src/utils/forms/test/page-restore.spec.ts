import { PAGE_RESTORE_CHECK_DURATION, syncValueOnPageRestore } from '../page-restore';

/**
 * The helper checks the field on animation frames for a set duration, so the
 * tests drive the frames and the clock by hand.
 */
let frames: Array<() => void>;

const flushFrames = () => {
  const batch = frames;
  frames = [];
  batch.forEach((callback) => callback());
};

/**
 * `raf` reads `requestAnimationFrame` off the global at call time, and
 * Stencil's mock window exposes it as a getter, so it has to be replaced on
 * `globalThis` rather than assigned or spied on.
 */
let originalRaf: PropertyDescriptor | undefined;

const pageShow = (persisted: boolean) => ({ persisted } as PageTransitionEvent);

describe('syncValueOnPageRestore', () => {
  let nativeInput: HTMLInputElement;
  let onValueChange: jest.Mock;
  let now: number;

  beforeEach(() => {
    frames = [];
    onValueChange = jest.fn();
    now = 0;
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    originalRaf = Object.getOwnPropertyDescriptor(globalThis, 'requestAnimationFrame');
    Object.defineProperty(globalThis, 'requestAnimationFrame', {
      value: (callback: FrameRequestCallback) => frames.push(() => callback(0)),
      configurable: true,
      writable: true,
    });

    nativeInput = document.createElement('input');
    nativeInput.value = 'typed';
  });

  afterEach(() => {
    jest.restoreAllMocks();

    if (originalRaf) {
      Object.defineProperty(globalThis, 'requestAnimationFrame', originalRaf);
    } else {
      delete (globalThis as any).requestAnimationFrame;
    }
  });

  it('should read the field on the next frame, after the browser clears it', () => {
    syncValueOnPageRestore(pageShow(true), nativeInput, () => 'typed', onValueChange);

    // The browser clears the field after pageshow, before the next frame.
    nativeInput.value = '';
    expect(onValueChange).not.toHaveBeenCalled();

    flushFrames();

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('should keep checking each frame until the browser clears the field', () => {
    syncValueOnPageRestore(pageShow(true), nativeInput, () => 'typed', onValueChange);

    flushFrames();
    expect(onValueChange).not.toHaveBeenCalled();

    // The clear lands a few frames late, still within the check duration.
    now = PAGE_RESTORE_CHECK_DURATION / 2;
    nativeInput.value = '';
    flushFrames();

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('');
  });

  it('should stop checking once the value is synced', () => {
    syncValueOnPageRestore(pageShow(true), nativeInput, () => 'typed', onValueChange);

    nativeInput.value = '';
    flushFrames();

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(frames).toHaveLength(0);
  });

  it('should stop checking once the check duration ends', () => {
    syncValueOnPageRestore(pageShow(true), nativeInput, () => 'typed', onValueChange);

    now = PAGE_RESTORE_CHECK_DURATION;
    flushFrames();

    expect(onValueChange).not.toHaveBeenCalled();
    expect(frames).toHaveLength(0);
  });

  it('should compare against the value when the frame runs', () => {
    let value = 'typed';
    syncValueOnPageRestore(pageShow(true), nativeInput, () => value, onValueChange);

    // The app sets the value before the frame, which updates the field too.
    value = 'restored';
    nativeInput.value = 'restored';
    flushFrames();

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('should not check the field when the page is not restored', () => {
    syncValueOnPageRestore(pageShow(false), nativeInput, () => 'typed', onValueChange);

    expect(frames).toHaveLength(0);
  });

  it('should not check the field when there is no native input', () => {
    syncValueOnPageRestore(pageShow(true), undefined, () => 'typed', onValueChange);

    expect(frames).toHaveLength(0);
  });
});
