const ION_FOCUSED = 'ion-focused';
const ION_FOCUSABLE = 'ion-focusable';

export interface FocusVisibleUtility {
  destroy: () => void;
  setFocus: (elements: Element[]) => void;
}

export const startFocusVisible = (rootEl?: HTMLElement): FocusVisibleUtility => {
  let currentFocus: Element[] = [];

  const ref = rootEl ? rootEl.shadowRoot! : document;
  const root = rootEl ? rootEl : document.body;

  const setFocus = (elements: Element[]) => {
    currentFocus.forEach((el) => el.classList.remove(ION_FOCUSED));
    elements.forEach((el) => el.classList.add(ION_FOCUSED));
    currentFocus = elements;
  };

  const pointerDown = () => {
    setFocus([]);
  };

  const onFocusin = (ev: Event) => {
    const toFocus = ev.composedPath().filter((el): el is HTMLElement => {
      return el instanceof HTMLElement && el.classList.contains(ION_FOCUSABLE);
    });

    setFocus(toFocus);
  };

  const onFocusout = () => {
    if (ref.activeElement === root) {
      setFocus([]);
    }
  };

  ref.addEventListener('focusin', onFocusin);
  ref.addEventListener('focusout', onFocusout);
  ref.addEventListener('touchstart', pointerDown, { passive: true });
  ref.addEventListener('mousedown', pointerDown);

  const destroy = () => {
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
