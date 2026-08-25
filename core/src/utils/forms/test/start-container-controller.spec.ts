// @vitest-environment stencil

import type { StartContainerController } from '../start-container-controller';
import {
  SKIP_LABEL_TRANSITION_CLASS,
  START_CONTAINER_ADJUSTMENT_VAR,
  createStartContainerController,
} from '../start-container-controller';

/**
 * The controller defers every measurement to an animation frame, so the tests
 * drive the frames by hand. Frames queued from inside a frame are held back
 * until the next flush, which mirrors the browser and keeps the two-frame
 * class toggle observable.
 */
let frames: Map<number, () => void>;
let nextFrameId: number;

const requestFrame = (callback: () => void) => {
  const id = nextFrameId++;
  frames.set(id, callback);
  return id;
};

/**
 * Callbacks are keyed by id rather than held in an array so that cancelling
 * one that is queued for the frame currently being flushed still takes effect,
 * the way `cancelAnimationFrame` does in a browser.
 */
const flushFrames = () => {
  const batch = Array.from(frames.keys());

  batch.forEach((id) => {
    const callback = frames.get(id);

    // Cancelled earlier in this same flush
    if (callback === undefined) {
      return;
    }

    frames.delete(id);
    callback();
  });
};

/**
 * Records every ResizeObserver the controller creates so the tests can assert
 * on what is being watched and what has been torn down.
 */
class MockResizeObserver {
  static instances: MockResizeObserver[] = [];

  observed: Element[] = [];
  disconnected = false;

  constructor(public callback: () => void) {
    MockResizeObserver.instances.push(this);
  }

  observe(target: Element) {
    this.observed.push(target);
  }

  disconnect() {
    this.disconnected = true;
  }
}

const activeObserver = () => MockResizeObserver.instances.find((observer) => !observer.disconnected);

/**
 * The controller reaches for `requestAnimationFrame` and `ResizeObserver` as
 * globals, and Stencil's mock window exposes them as getters, so they have to
 * be replaced on `globalThis` rather than assigned or spied on.
 */
const globalOverrides = new Map<string, PropertyDescriptor | undefined>();

const overrideGlobal = (key: string, value: unknown) => {
  if (!globalOverrides.has(key)) {
    globalOverrides.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
  }
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
};

const restoreGlobals = () => {
  globalOverrides.forEach((descriptor, key) => {
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as any)[key];
    }
  });
  globalOverrides.clear();
};

describe('Start Container Controller', () => {
  let host: HTMLElement;
  let startContainer: HTMLElement;
  let controller: StartContainerController;
  let shouldApply: boolean;

  const setStartWidth = (width: number) => {
    startContainer.getBoundingClientRect = () => ({ width } as DOMRect);
  };

  const getAdjustment = () => host.style.getPropertyValue(START_CONTAINER_ADJUSTMENT_VAR);

  const hasSkipClass = () => host.classList.contains(SKIP_LABEL_TRANSITION_CLASS);

  /**
   * Runs a measurement the way a render does: schedule it, then let the
   * measurement frame and the follow-up transition frame run.
   */
  const measure = () => {
    controller.calculateStartContainerWidth();
    flushFrames();
    flushFrames();
  };

  beforeEach(() => {
    frames = new Map();
    nextFrameId = 1;
    MockResizeObserver.instances = [];
    shouldApply = true;

    overrideGlobal('ResizeObserver', MockResizeObserver);
    overrideGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => requestFrame(() => callback(0)));
    overrideGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));

    host = document.createElement('div');
    startContainer = document.createElement('div');
    host.appendChild(startContainer);
    document.body.appendChild(host);

    setStartWidth(32);

    controller = createStartContainerController(
      host,
      () => startContainer,
      () => shouldApply
    );
  });

  afterEach(() => {
    controller.destroy();
    host.remove();
    restoreGlobals();
  });

  describe('measurement', () => {
    it('should set the adjustment to the negated start container width', () => {
      measure();

      expect(getAdjustment()).toBe('-32px');
    });

    it('should round the width to one decimal place', () => {
      setStartWidth(32.06);

      measure();

      expect(getAdjustment()).toBe('-32.1px');
    });

    it('should not measure until the next frame', () => {
      controller.calculateStartContainerWidth();

      expect(getAdjustment()).toBe('');
    });

    it('should apply a queued measurement even when a render asks for another one first', () => {
      /**
       * A render running earlier in the same frame reaches `componentDidRender`
       * before the queued measurement. Rescheduling at that point would push
       * the offset into the next frame, leaving one painted frame where the
       * content has changed but the label has not moved.
       */
      requestAnimationFrame(() => controller.calculateStartContainerWidth());
      controller.calculateStartContainerWidth();

      flushFrames();

      expect(getAdjustment()).toBe('-32px');
    });

    it('should clear the adjustment when it no longer applies', () => {
      measure();
      expect(getAdjustment()).toBe('-32px');

      shouldApply = false;
      measure();

      expect(getAdjustment()).toBe('');
    });

    it('should report a zero width without a sign', () => {
      setStartWidth(0);

      measure();

      expect(getAdjustment()).toBe('0px');
    });

    it('should not negate the adjustment in rtl', () => {
      host.dir = 'rtl';

      measure();

      expect(getAdjustment()).toBe('32px');
    });
  });

  describe('label transition', () => {
    it('should suppress the transition for one frame when the offset changes', () => {
      controller.calculateStartContainerWidth();

      flushFrames();
      expect(hasSkipClass()).toBe(true);

      flushFrames();
      expect(hasSkipClass()).toBe(false);
    });

    it('should not suppress the transition when the offset is unchanged', () => {
      measure();

      controller.calculateStartContainerWidth();
      flushFrames();

      expect(hasSkipClass()).toBe(false);
    });

    it('should keep the transition suppressed while consecutive changes are applied', () => {
      controller.calculateStartContainerWidth();
      flushFrames();

      /**
       * The removal queued by the first change would otherwise run in the same
       * frame that applies the second one.
       */
      setStartWidth(64);
      controller.calculateStartContainerWidth();
      flushFrames();

      expect(getAdjustment()).toBe('-64px');
      expect(hasSkipClass()).toBe(true);
    });
  });

  describe('resize observer', () => {
    it('should observe the start container after measuring', () => {
      measure();

      expect(activeObserver()?.observed).toEqual([startContainer]);
    });

    it('should not rebind the observer when the container is unchanged', () => {
      measure();
      measure();

      expect(MockResizeObserver.instances).toHaveLength(1);
      expect(activeObserver()?.observed).toEqual([startContainer]);
    });

    it('should rebind when the start container is replaced', () => {
      measure();
      const firstObserver = activeObserver();

      startContainer = document.createElement('div');
      setStartWidth(48);
      measure();

      expect(firstObserver?.disconnected).toBe(true);
      expect(activeObserver()?.observed).toEqual([startContainer]);
    });

    it('should re-measure when the container resizes', () => {
      measure();

      setStartWidth(64);
      activeObserver()?.callback();
      flushFrames();

      expect(getAdjustment()).toBe('-64px');
    });

    it('should disconnect when the adjustment stops applying', () => {
      measure();
      const observer = activeObserver();

      shouldApply = false;
      measure();

      expect(observer?.disconnected).toBe(true);
      expect(activeObserver()).toBeUndefined();
    });

    it('should observe again when the adjustment starts applying', () => {
      shouldApply = false;
      measure();
      expect(activeObserver()).toBeUndefined();

      shouldApply = true;
      measure();

      expect(getAdjustment()).toBe('-32px');
      expect(activeObserver()?.observed).toEqual([startContainer]);
    });
  });

  describe('destroy()', () => {
    it('should disconnect the observer', () => {
      measure();
      const observer = activeObserver();

      controller.destroy();

      expect(observer?.disconnected).toBe(true);
    });

    it('should not measure after a pending frame is cancelled', () => {
      controller.calculateStartContainerWidth();
      controller.destroy();

      flushFrames();

      expect(getAdjustment()).toBe('');
    });

    it('should not leave the transition suppressed when torn down mid-toggle', () => {
      controller.calculateStartContainerWidth();

      // The class is applied, but the frame that removes it has not run yet
      flushFrames();
      expect(hasSkipClass()).toBe(true);

      controller.destroy();

      expect(hasSkipClass()).toBe(false);
    });

    it('should re-apply the adjustment after being destroyed', () => {
      measure();
      controller.destroy();

      controller = createStartContainerController(
        host,
        () => startContainer,
        () => shouldApply
      );
      measure();

      expect(getAdjustment()).toBe('-32px');
      expect(activeObserver()?.observed).toEqual([startContainer]);
    });
  });
});
