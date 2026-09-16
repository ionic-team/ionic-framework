const ION_FOCUSED = 'ion-focused';
const ION_FOCUSABLE = 'ion-focusable';
const FOCUS_KEYS = [
  'Tab',
  'ArrowDown',
  'Space',
  'Escape',
  ' ',
  'Shift',
  'Enter',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'Home',
  'End',
];

export interface FocusVisibleUtility {
  destroy: () => void;
  setFocus: (elements: Element[]) => void;
  isKeyboardMode: () => boolean;
}

let focusVisibleUtility: FocusVisibleUtility | null = null;

export const getOrInitFocusVisibleUtility = () => {
  if (!focusVisibleUtility) {
    focusVisibleUtility = startFocusVisible();
  }

  return focusVisibleUtility;
};

/**
 * Used to set focus on an element that uses `ion-focusable`.
 * Do not use this if focusing the element as a result of a keyboard
 * event as the focus utility should handle this for us. This method
 * should be used when we want to programmatically focus an element as
 * a result of another user action. (Ex: We focus the first element
 * inside of a popover when the user presents it, but the popover is not always
 * presented as a result of keyboard action.)
 *
 * @param elements - The elements to set focus on.
 */
export const focusElements = (elements: Element[]) => {
  const focusVisible = getOrInitFocusVisibleUtility();
  focusVisible.setFocus(elements);
};

/**
 * Reports whether the most recent interaction on the page was keyboard-driven.
 *
 * Check this before drawing the keyboard focus indicator programmatically.
 *
 * @returns `true` while the user is navigating with a keyboard, and before the
 * first interaction on the page.
 */
export const isKeyboardMode = () => getOrInitFocusVisibleUtility().isKeyboardMode();

/**
 * Watches how the user is interacting with the page and marks the focused
 * element with `ion-focused`, so the keyboard focus indicator is only drawn
 * while the user navigates with a keyboard.
 *
 * @param rootEl Scopes the utility to this element's shadow root, so it only
 * reacts to interactions inside it. Omit it to listen on the document.
 * @returns `setFocus` to mark elements focused programmatically, and `destroy`
 * to detach the listeners.
 */
export const startFocusVisible = (rootEl?: HTMLElement): FocusVisibleUtility => {
  let currentFocus: Element[] = [];

  /*
   * Starts as `true` so an element focused before the user has interacted,
   * such as one focused on page load, still draws an indicator.
   */
  let keyboardMode = true;

  /*
   * `ref` is where the listeners go and `root` is the element focus falls back
   * to once it leaves everything inside `ref`.
   */
  const ref = rootEl ? rootEl.shadowRoot! : document;
  const root = rootEl ? rootEl : document.body;

  const setFocus = (elements: Element[]) => {
    currentFocus.forEach((el) => el.classList.remove(ION_FOCUSED));
    elements.forEach((el) => el.classList.add(ION_FOCUSED));
    currentFocus = elements;
  };
  const pointerDown = () => {
    keyboardMode = false;
    setFocus([]);
  };

  /*
   * Only the keys that move focus keep the indicator on. Any other key means
   * the user is typing into the focused element rather than navigating, so the
   * indicator is dropped.
   */
  const onKeydown = (ev: Event) => {
    keyboardMode = FOCUS_KEYS.includes((ev as KeyboardEvent).key);
    if (!keyboardMode) {
      setFocus([]);
    }
  };

  /*
   * The indicator does not always belong to the element that took focus. The
   * composed path is walked so every `ion-focusable` ancestor is marked too,
   * which is how an `ion-item` draws the indicator for a checkbox slotted into
   * it, since a checkbox in an item drops the class itself. The composed path
   * is used because it reaches hosts across shadow boundaries.
   */
  const onFocusin = (ev: Event) => {
    if (keyboardMode && ev.composedPath !== undefined) {
      const toFocus = ev.composedPath().filter((el: any) => {
        // TODO(FW-2832): type
        if (el.classList) {
          return el.classList.contains(ION_FOCUSABLE);
        }
        return false;
      }) as Element[];
      setFocus(toFocus);
    }
  };

  /*
   * Focus landing back on `root` means it left every focusable element, so
   * nothing should stay marked. Focus moving between elements is left alone
   * because `onFocusin` marks the new one.
   */
  const onFocusout = () => {
    if (ref.activeElement === root) {
      setFocus([]);
    }
  };

  ref.addEventListener('keydown', onKeydown);
  ref.addEventListener('focusin', onFocusin);
  ref.addEventListener('focusout', onFocusout);
  ref.addEventListener('touchstart', pointerDown, { passive: true });
  ref.addEventListener('mousedown', pointerDown);

  const destroy = () => {
    ref.removeEventListener('keydown', onKeydown);
    ref.removeEventListener('focusin', onFocusin);
    ref.removeEventListener('focusout', onFocusout);
    ref.removeEventListener('touchstart', pointerDown);
    ref.removeEventListener('mousedown', pointerDown);
  };

  return {
    destroy,
    setFocus,
    isKeyboardMode: () => keyboardMode,
  };
};
