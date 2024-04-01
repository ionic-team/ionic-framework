import { Keyboard } from '../native/keyboard';

export const KEYBOARD_DID_OPEN =
  'ionKeyboardDidShow';
export const KEYBOARD_DID_CLOSE =
  'ionKeyboardDidHide';
const KEYBOARD_THRESHOLD = 150;

// TODO(FW-2832): types

let previousVisualViewport: any = {};
let currentVisualViewport: any = {};

let keyboardOpen = false;

/**
 * This is only used for tests
 */
export const resetKeyboardAssist =
  () => {
    previousVisualViewport = {};
    currentVisualViewport = {};
    keyboardOpen = false;
  };

export const startKeyboardAssist = (
  win: Window
) => {
  const nativeEngine =
    Keyboard.getEngine();

  /**
   * If the native keyboard plugin is available
   * then we are running in a native environment. As a result
   * we should only listen on the native events instead of
   * using the Visual Viewport as the Ionic webview manipulates
   * how it resizes such that the Visual Viewport API is not
   * reliable here.
   */
  if (nativeEngine) {
    startNativeListeners(win);
  } else {
    if (!(win as any).visualViewport) {
      return;
    }

    currentVisualViewport =
      copyVisualViewport(
        (win as any).visualViewport
      );

    (
      win as any
    ).visualViewport.onresize = () => {
      trackViewportChanges(win);

      if (
        keyboardDidOpen() ||
        keyboardDidResize(win)
      ) {
        setKeyboardOpen(win);
      } else if (
        keyboardDidClose(win)
      ) {
        setKeyboardClose(win);
      }
    };
  }
};

/**
 * Listen for events fired by native keyboard plugin
 * in Capacitor/Cordova so devs only need to listen
 * in one place.
 */
const startNativeListeners = (
  win: Window
) => {
  win.addEventListener(
    'keyboardDidShow',
    (ev) => setKeyboardOpen(win, ev)
  );
  win.addEventListener(
    'keyboardDidHide',
    () => setKeyboardClose(win)
  );
};

export const setKeyboardOpen = (
  win: Window,
  ev?: any
) => {
  fireKeyboardOpenEvent(win, ev);
  keyboardOpen = true;
};

export const setKeyboardClose = (
  win: Window
) => {
  fireKeyboardCloseEvent(win);
  keyboardOpen = false;
};

/**
 * Returns `true` if the `keyboardOpen` flag is not
 * set, the previous visual viewport width equal the current
 * visual viewport width, and if the scaled difference
 * of the previous visual viewport height minus the current
 * visual viewport height is greater than KEYBOARD_THRESHOLD
 *
 * We need to be able to accommodate users who have zooming
 * enabled in their browser (or have zoomed in manually) which
 * is why we take into account the current visual viewport's
 * scale value.
 */
export const keyboardDidOpen =
  (): boolean => {
    const scaledHeightDifference =
      (previousVisualViewport.height -
        currentVisualViewport.height) *
      currentVisualViewport.scale;
    return (
      !keyboardOpen &&
      previousVisualViewport.width ===
        currentVisualViewport.width &&
      scaledHeightDifference >
        KEYBOARD_THRESHOLD
    );
  };

/**
 * Returns `true` if the keyboard is open,
 * but the keyboard did not close
 */
export const keyboardDidResize = (
  win: Window
): boolean => {
  return (
    keyboardOpen &&
    !keyboardDidClose(win)
  );
};

/**
 * Determine if the keyboard was closed
 * Returns `true` if the `keyboardOpen` flag is set and
 * the current visual viewport height equals the
 * layout viewport height.
 */
export const keyboardDidClose = (
  win: Window
): boolean => {
  return (
    keyboardOpen &&
    currentVisualViewport.height ===
      win.innerHeight
  );
};

/**
 * Dispatch a keyboard open event
 */
const fireKeyboardOpenEvent = (
  win: Window,
  nativeEv?: any
): void => {
  const keyboardHeight = nativeEv
    ? nativeEv.keyboardHeight
    : win.innerHeight -
      currentVisualViewport.height;
  const ev = new CustomEvent(
    KEYBOARD_DID_OPEN,
    {
      detail: { keyboardHeight },
    }
  );

  win.dispatchEvent(ev);
};

/**
 * Dispatch a keyboard close event
 */
const fireKeyboardCloseEvent = (
  win: Window
): void => {
  const ev = new CustomEvent(
    KEYBOARD_DID_CLOSE
  );
  win.dispatchEvent(ev);
};

/**
 * Given a window object, create a copy of
 * the current visual and layout viewport states
 * while also preserving the previous visual and
 * layout viewport states
 */
export const trackViewportChanges = (
  win: Window
) => {
  previousVisualViewport = {
    ...currentVisualViewport,
  };
  currentVisualViewport =
    copyVisualViewport(
      (win as any).visualViewport
    );
};

/**
 * Creates a deep copy of the visual viewport
 * at a given state
 */
export const copyVisualViewport = (
  visualViewport: any
): any => {
  return {
    width: Math.round(
      visualViewport.width
    ),
    height: Math.round(
      visualViewport.height
    ),
    offsetTop: visualViewport.offsetTop,
    offsetLeft:
      visualViewport.offsetLeft,
    pageTop: visualViewport.pageTop,
    pageLeft: visualViewport.pageLeft,
    scale: visualViewport.scale,
  };
};
