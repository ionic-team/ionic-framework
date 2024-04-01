import { addEventListener } from './listener';

const MOUSE_WAIT = 2000;

// TODO(FW-2832): types
export const createPointerEvents = (
  el: Node,
  pointerDown: any,
  pointerMove: any,
  pointerUp: any,
  options: {
    passive?: boolean;
    capture?: boolean;
  }
) => {
  let rmTouchStart:
    | (() => void)
    | undefined;
  let rmTouchMove:
    | (() => void)
    | undefined;
  let rmTouchEnd:
    | (() => void)
    | undefined;
  let rmTouchCancel:
    | (() => void)
    | undefined;
  let rmMouseStart:
    | (() => void)
    | undefined;
  let rmMouseMove:
    | (() => void)
    | undefined;
  let rmMouseUp:
    | (() => void)
    | undefined;
  let lastTouchEvent = 0;

  const handleTouchStart = (
    ev: any
  ) => {
    lastTouchEvent =
      Date.now() + MOUSE_WAIT;
    if (!pointerDown(ev)) {
      return;
    }
    if (!rmTouchMove && pointerMove) {
      rmTouchMove = addEventListener(
        el,
        'touchmove',
        pointerMove,
        options
      );
    }

    /**
     * Events are dispatched on the element that is tapped and bubble up to
     * the reference element in the gesture. In the event that the element this
     * event was first dispatched on is removed from the DOM, the event will no
     * longer bubble up to our reference element. This leaves the gesture in an
     * unusable state. To account for this, the touchend and touchcancel listeners
     * should be added to the event target so that they still fire even if the target
     * is removed from the DOM.
     */
    if (!rmTouchEnd) {
      rmTouchEnd = addEventListener(
        ev.target,
        'touchend',
        handleTouchEnd,
        options
      );
    }
    if (!rmTouchCancel) {
      rmTouchCancel = addEventListener(
        ev.target,
        'touchcancel',
        handleTouchEnd,
        options
      );
    }
  };

  const handleMouseDown = (ev: any) => {
    if (lastTouchEvent > Date.now()) {
      return;
    }
    if (!pointerDown(ev)) {
      return;
    }
    if (!rmMouseMove && pointerMove) {
      rmMouseMove = addEventListener(
        getDocument(el),
        'mousemove',
        pointerMove,
        options
      );
    }
    if (!rmMouseUp) {
      rmMouseUp = addEventListener(
        getDocument(el),
        'mouseup',
        handleMouseUp,
        options
      );
    }
  };

  const handleTouchEnd = (ev: any) => {
    stopTouch();
    if (pointerUp) {
      pointerUp(ev);
    }
  };

  const handleMouseUp = (ev: any) => {
    stopMouse();
    if (pointerUp) {
      pointerUp(ev);
    }
  };

  const stopTouch = () => {
    if (rmTouchMove) {
      rmTouchMove();
    }
    if (rmTouchEnd) {
      rmTouchEnd();
    }
    if (rmTouchCancel) {
      rmTouchCancel();
    }
    rmTouchMove =
      rmTouchEnd =
      rmTouchCancel =
        undefined;
  };

  const stopMouse = () => {
    if (rmMouseMove) {
      rmMouseMove();
    }
    if (rmMouseUp) {
      rmMouseUp();
    }
    rmMouseMove = rmMouseUp = undefined;
  };

  const stop = () => {
    stopTouch();
    stopMouse();
  };

  const enable = (isEnabled = true) => {
    if (!isEnabled) {
      if (rmTouchStart) {
        rmTouchStart();
      }
      if (rmMouseStart) {
        rmMouseStart();
      }
      rmTouchStart = rmMouseStart =
        undefined;
      stop();
    } else {
      if (!rmTouchStart) {
        rmTouchStart = addEventListener(
          el,
          'touchstart',
          handleTouchStart,
          options
        );
      }
      if (!rmMouseStart) {
        rmMouseStart = addEventListener(
          el,
          'mousedown',
          handleMouseDown,
          options
        );
      }
    }
  };

  const destroy = () => {
    enable(false);
    pointerUp =
      pointerMove =
      pointerDown =
        undefined;
  };

  return {
    enable,
    stop,
    destroy,
  };
};

const getDocument = (node: Node) => {
  return node instanceof Document
    ? node
    : node.ownerDocument;
};

export interface PointerEventsConfig {
  element?: HTMLElement;
  pointerDown: (ev: any) => boolean;
  pointerMove?: (ev: any) => void;
  pointerUp?: (ev: any) => void;
  zone?: boolean;
  capture?: boolean;
  passive?: boolean;
}
