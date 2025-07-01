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

export const startFocusVisible = (rootEl?: HTMLElement): FocusVisibleUtility => {
  let currentFocus: Element[] = [];
  let keyboardMode = false;
  let lastPointerType: string | null = null;

  const ref = rootEl ? rootEl.shadowRoot! : document;
  const root = rootEl ? rootEl : document.body;

  const setFocus = (elements: Element[]) => {
    currentFocus.forEach((el) => el.classList.remove(ION_FOCUSED));
    elements.forEach((el) => el.classList.add(ION_FOCUSED));
    currentFocus = elements;
  };

  const pointerDown = (ev: Event) => {
    const pointerEvent = ev as PointerEvent;
    lastPointerType = pointerEvent.pointerType;
    keyboardMode = false;
    setFocus([]);
  };

  const onKeydown = (ev: Event) => {
    const keyboardEvent = ev as KeyboardEvent;
    // Always set keyboard mode to true when any key is pressed
    // This handles the WebKit Tab key bug where keydown might not fire
    keyboardMode = true;

    // If it's not a focus key, clear focus immediately
    if (!FOCUS_KEYS.includes(keyboardEvent.key)) {
      setFocus([]);
    }
  };

  const onFocusin = (ev: Event) => {
    // Check if this focus event is likely from keyboard navigation
    // We can detect this by checking if there was a recent keydown event
    // or if the focus target is a focusable element that typically gets focus via keyboard
    const target = ev.target as HTMLElement;

    if (target.classList.contains(ION_FOCUSABLE)) {
      // If we're in keyboard mode or this looks like keyboard navigation
      if (keyboardMode || !lastPointerType) {
        const toFocus = ev.composedPath().filter((el): el is HTMLElement => {
          return el instanceof HTMLElement && el.classList.contains(ION_FOCUSABLE);
        });
        setFocus(toFocus);
      }
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
  ref.addEventListener('pointerdown', pointerDown, { passive: true });
  ref.addEventListener('touchstart', pointerDown, { passive: true });
  ref.addEventListener('mousedown', pointerDown);

  const destroy = () => {
    ref.removeEventListener('keydown', onKeydown);
    ref.removeEventListener('focusin', onFocusin);
    ref.removeEventListener('focusout', onFocusout);
    ref.removeEventListener('pointerdown', pointerDown);
    ref.removeEventListener('touchstart', pointerDown);
    ref.removeEventListener('mousedown', pointerDown);
  };

  return {
    destroy,
    setFocus,
  };
};
