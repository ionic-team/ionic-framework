const cloneMap = new WeakMap<HTMLElement, HTMLElement>();

export const relocateInput = (
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  shouldRelocate: boolean,
  inputRelativeY = 0
) => {
  if (cloneMap.has(inputEl) === shouldRelocate) {
    return;
  }

  if (shouldRelocate) {
    addClone(inputEl, inputRelativeY);
  } else {
    removeClone(inputEl);
  }
};

export const isFocused = (input: HTMLInputElement | HTMLTextAreaElement): boolean => {
  return input === (input as any).getRootNode().activeElement;
};

const addClone = (inputEl: HTMLInputElement | HTMLTextAreaElement, inputRelativeY: number) => {
  // this allows for the actual input to receive the focus from
  // the user's touch event, but before it receives focus, it
  // moves the actual input to a location that will not screw
  // up the app's layout, and does not allow the native browser
  // to attempt to scroll the input into place (messing up headers/footers)
  // the cloned input fills the area of where native input should be
  // while the native input fakes out the browser by relocating itself
  // before it receives the actual focus event
  // We hide the focused input (with the visible caret) invisible by making it scale(0),
  const parentEl = inputEl.parentNode!;

  // DOM WRITES
  const clonedEl = inputEl.cloneNode(false) as HTMLElement;
  clonedEl.classList.remove('ion-input');
  clonedEl.style.pointerEvents = 'none';
  clonedEl.tabIndex = -1;
  parentEl.insertBefore(clonedEl, inputEl);
  cloneMap.set(inputEl, clonedEl);

  const doc = inputEl.ownerDocument!;
  const tx = doc.dir === 'rtl' ? 9999 : -9999;
  inputEl.style.pointerEvents = 'none';
  inputEl.style.position = 'absolute';
  inputEl.style.top = '0';
  inputEl.style.left = '0';
  inputEl.style.transform = `translate3d(${tx}px,${inputRelativeY}px,0) scale(0)`;
};

const removeClone = (inputEl: HTMLElement) => {
  const clonedEl = cloneMap.get(inputEl);
  if (clonedEl) {
    cloneMap.delete(inputEl);
    clonedEl.remove();
  }
  inputEl.style.removeProperty('position');
  inputEl.style.removeProperty('top');
  inputEl.style.removeProperty('left');
  inputEl.style.removeProperty('pointer-events');
  inputEl.style.removeProperty('transform');
};
