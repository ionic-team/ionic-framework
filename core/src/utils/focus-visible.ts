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
  'Meta',
];

export interface FocusVisibleUtility {
  destroy: () => void;
  setFocus: (elements: Element[]) => void;
}

export const startFocusVisible = (rootEl?: HTMLElement): FocusVisibleUtility => {
  let currentFocus: Element[] = [];
  let keyboardMode = true;

  const ref = rootEl ? rootEl.shadowRoot! : document;
  const root = rootEl ? rootEl : document.body;

  const setFocus = (elements: Element[]) => {
    console.log('setFocus', elements, currentFocus);
    console.log('keyboardMode', keyboardMode);
    currentFocus.forEach((el) => el.classList.remove(ION_FOCUSED));
    elements.forEach((el) => el.classList.add(ION_FOCUSED));
    currentFocus = elements;
  };
  // SPACE triggers on iOS device with physical keyboard
  const pointerDown = (ev: Event) => {
    console.log('pointerDown', ev);
    console.log('keyboardMode', keyboardMode);
    keyboardMode = false;
    setFocus([]);
  };
// Enter triggers on iOS device with physical keyboard
  const onKeydown = (ev: Event) => {
    console.log('onKeydown', ev);
    console.log('keyboardMode', keyboardMode);
    keyboardMode = FOCUS_KEYS.includes((ev as KeyboardEvent).key);
    if (!keyboardMode) {
      setFocus([]);
    }
  };
  const onFocusin = (ev: Event) => {
    console.log('onFocusin', ev);
    console.log('keyboardMode', keyboardMode);
    let toFocus: Element[] = [];
    if (keyboardMode && ev.composedPath !== undefined) {
      toFocus = ev.composedPath().filter((el: any) => {
        // TODO(FW-2832): type
        if (el.classList) {
          return el.classList.contains(ION_FOCUSABLE);
        }
        return false;
      }) as Element[];
      setFocus(toFocus);
    }
    console.log('toFocus', toFocus);
    if (toFocus.length > 0) {
      keyboardMode = true;
    }
  };
  const onFocusout = () => {
    console.log('onFocusout');
    console.log('keyboardMode', keyboardMode);
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
