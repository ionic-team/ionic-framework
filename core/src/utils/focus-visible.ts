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
 */
export const focusElements = (elements: Element[]) => {
  const focusVisible = getOrInitFocusVisibleUtility();
  focusVisible.setFocus(elements);
};

export const startFocusVisible = (rootEl?: HTMLElement): FocusVisibleUtility => {
  let currentFocus: Element[] = [];
  let keyboardMode = true;

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

  const onKeydown = (ev: Event) => {
    keyboardMode = FOCUS_KEYS.includes((ev as KeyboardEvent).key);
    if (!keyboardMode) {
      setFocus([]);
    }
  };
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
  };
};
