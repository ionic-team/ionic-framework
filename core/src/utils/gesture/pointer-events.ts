import { addEventListener } from './listener';

const MOUSE_WAIT = 2000;

export function createPointerEvents(
  el: Node,
  pointerDown: any,
  pointerMove: any,
  pointerUp: any,
  options: EventListenerOptions
) {

  let rmTouchStart: (() => void) | undefined;
  let rmTouchMove: (() => void) | undefined;
  let rmTouchEnd: (() => void) | undefined;
  let rmTouchCancel: (() => void) | undefined;
  let rmMouseStart: (() => void) | undefined;
  let rmMouseMove: (() => void) | undefined;
  let rmMouseUp: (() => void) | undefined;
  let lastTouchEvent = 0;

  function handleTouchStart(ev: any) {
    lastTouchEvent = Date.now() + MOUSE_WAIT;
    if (!pointerDown(ev)) {
      return;
    }
    if (!rmTouchMove && pointerMove) {
      rmTouchMove = addEventListener(el, 'touchmove', pointerMove, options);
    }
    if (!rmTouchEnd) {
      rmTouchEnd = addEventListener(el, 'touchend', handleTouchEnd, options);
    }
    if (!rmTouchCancel) {
      rmTouchCancel = addEventListener(el, 'touchcancel', handleTouchEnd, options);
    }
  }

  function handleMouseDown(ev: any) {
    if (lastTouchEvent > Date.now()) {
      console.debug('mousedown event dropped because of previous touch');
      return;
    }
    if (!pointerDown(ev)) {
      return;
    }
    if (!rmMouseMove && pointerMove) {
      rmMouseMove = addEventListener(getDocument(el), 'mousemove', pointerMove, options);
    }
    if (!rmMouseUp) {
      rmMouseUp = addEventListener(getDocument(el), 'mouseup', handleMouseUp, options);
    }
  }

  function handleTouchEnd(ev: any) {
    stopTouch();
    if (pointerUp) {
      pointerUp(ev);
    }
  }

  function handleMouseUp(ev: any) {
    stopMouse();
    if (pointerUp) {
      pointerUp(ev);
    }
  }

  function stopTouch() {
    if (rmTouchMove) {
      rmTouchMove();
    }
    if (rmTouchEnd) {
      rmTouchEnd();
    }
    if (rmTouchCancel) {
      rmTouchCancel();
    }
    rmTouchMove = rmTouchEnd = rmTouchCancel = undefined;
  }

  function stopMouse() {
    if (rmMouseMove) {
      rmMouseMove();
    }
    if (rmMouseUp) {
      rmMouseUp();
    }
    rmMouseMove = rmMouseUp = undefined;
  }

  function stop() {
    stopTouch();
    stopMouse();
  }

  function setDisabled(disabled: boolean) {
    if (disabled) {
      if (rmTouchStart) {
        rmTouchStart();
      }
      if (rmMouseStart) {
        rmMouseStart();
      }
      rmTouchStart = rmMouseStart = undefined;
      stop();

    } else {
      if (!rmTouchStart) {
        rmTouchStart = addEventListener(el, 'touchstart', handleTouchStart, options);
      }
      if (!rmMouseStart) {
        rmMouseStart = addEventListener(el, 'mousedown', handleMouseDown, options);
      }
    }
  }

  function destroy() {
    setDisabled(true);
    pointerUp = pointerMove = pointerDown = undefined;
  }

  return {
    setDisabled,
    stop,
    destroy
  };
}

function getDocument(node: Node) {
  return node instanceof Document ? node : node.ownerDocument;
}

export interface PointerEventsConfig {
  element?: HTMLElement;
  pointerDown: (ev: any) => boolean;
  pointerMove?: (ev: any) => void;
  pointerUp?: (ev: any) => void;
  zone?: boolean;
  capture?: boolean;
  passive?: boolean;
}
