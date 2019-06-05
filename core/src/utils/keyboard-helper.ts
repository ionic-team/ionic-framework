enum KeyboardLifecycle {
  Open = 'ionKeyboardDidOpen',
  Close = 'ionKeyboardDidClose'
}

const KEYBOARD_THRESHOLD = 150;

let previousViewport: any = {};
let currentViewport: any = {};
let keyboardOpen = false;

export const startKeyboardHelper = (win: Window) => {
  if (!(win as any).visualViewport) { return; }

  currentViewport = copyVisualViewport((win as any).visualViewport);

  (win as any).visualViewport.addEventListener('resize', () => {
    trackVisualViewportChanges(win);

    if (keyboardDidOpen() || keyboardDidResize(win)) {
      fireKeyboardOpenEvent(win);
      keyboardOpen = true;
    } else if (keyboardDidClose(win)) {
      fireKeyboardCloseEvent(win);
      keyboardOpen = false;
    }
  });
};

/**
 * Returns `true` if the `keyboardOpen` flag is not
 * set, the previous visual viewport width equal the current
 * visual viewport width, and if the scaled difference
 * of the previous visual viewport height minus the current
 * visual viewport height is greater than KEYBOARD_THRESHOLD
 *
 * We need to be able to accomodate users who have zooming
 * enabled in their browser (or have zoomed in manually) which
 * is why we take into account the current visual viewport's
 * scale value.
 */
const keyboardDidOpen = (): boolean => {
  const scaledHeightDifference = (previousViewport.height - currentViewport.height) * currentViewport.scale;
  return (
    !keyboardOpen &&
    previousViewport.width === currentViewport.width &&
    scaledHeightDifference > KEYBOARD_THRESHOLD
  );
};

/**
 * Returns `true` if the keyboard is open,
 * but the keyboard did not close
 */
const keyboardDidResize = (win: Window): boolean => {
  return keyboardOpen && !keyboardDidClose(win);
};

/**
 * Determine if the keyboard was closed
 * Returns `true` if the `keyboardOpen` flag is set and
 * the current visual viewport height equals the
 * layout viewport height.
 */
const keyboardDidClose = (win: Window): boolean => {
  return keyboardOpen && currentViewport.height === win.innerHeight;
};

/**
 * Dispatch a keyboard open event
 */
const fireKeyboardOpenEvent = (win: Window): void => {
  const ev = new CustomEvent(KeyboardLifecycle.Open, {
    detail: { keyboardHeight: win.innerHeight - currentViewport.height }
  });

  win.dispatchEvent(ev);
};

/**
 * Dispatch a keyboard close event
 */
const fireKeyboardCloseEvent = (win: Window): void => {
  const ev = new CustomEvent(KeyboardLifecycle.Close);
  win.dispatchEvent(ev);
};

/**
 * Given a window object, create a copy of
 * the current visual viewport state, while also preserve
 * the previous visual viewport state
 */
const trackVisualViewportChanges = (win: Window) => {
  previousViewport = { ...currentViewport };
  currentViewport = copyVisualViewport((win as any).visualViewport);
};

/**
 * Creates a deep copy of the visual viewport
 * at a given state
 */
const copyVisualViewport = (visualViewport: any): any => {
  return {
    width: Math.round(visualViewport.width),
    height: Math.round(visualViewport.height),
    offsetTop: visualViewport.offsetTop,
    offsetLeft: visualViewport.offsetLeft,
    pageTop: visualViewport.pageTop,
    pageLeft: visualViewport.pageLeft,
    scale: visualViewport.scale
  };
};
