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
  // Tracks if the last interaction was a pointer event (mouse, touch, pen)
  // Used to distinguish between pointer and keyboard navigation for focus styling
  let hadPointerEvent = false;

  const ref = rootEl ? rootEl.shadowRoot! : document;
  const root = rootEl ? rootEl : document.body;

  // Adds or removes the focused class for styling
  const setFocus = (elements: Element[]) => {
    currentFocus.forEach((el) => el.classList.remove(ION_FOCUSED));
    elements.forEach((el) => el.classList.add(ION_FOCUSED));
    currentFocus = elements;
  };

  // Do not set focus on pointer interactions
  const pointerDown = (ev: Event) => {
    if (ev instanceof PointerEvent && ev.pointerType !== '') {
      hadPointerEvent = true;
      // Reset after the event loop so only the immediate focusin is suppressed
      setTimeout(() => {
        hadPointerEvent = false;
      }, 0);
    }
  };

  // Clear hadPointerEvent so keyboard navigation shows focus
  // Also, clear focus if the key is not a navigation key
  const onKeydown = (ev: Event) => {
    hadPointerEvent = false;

    const keyboardEvent = ev as KeyboardEvent;
    if (!FOCUS_KEYS.includes(keyboardEvent.key)) {
      setFocus([]);
    }
  };

  // Set focus if the last interaction was NOT a pointer event
  // This works around iOS/Safari bugs where keydown is not fired for Tab
  const onFocusin = (ev: Event) => {
    const target = ev.target as HTMLElement;
    if (target.classList.contains(ION_FOCUSABLE) && !hadPointerEvent) {
      const toFocus = ev
        .composedPath()
        .filter((el): el is HTMLElement => el instanceof HTMLElement && el.classList.contains(ION_FOCUSABLE));
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
  ref.addEventListener('pointerdown', pointerDown, { passive: true });

  const destroy = () => {
    ref.removeEventListener('keydown', onKeydown);
    ref.removeEventListener('focusin', onFocusin);
    ref.removeEventListener('focusout', onFocusout);
    ref.removeEventListener('pointerdown', pointerDown);
  };

  return {
    destroy,
    setFocus,
  };
};
