const cloneMap = new WeakMap<HTMLElement, HTMLElement>();

export const relocateInput = (
  componentEl: HTMLElement,
  inputEl: HTMLInputElement | HTMLTextAreaElement,
  shouldRelocate: boolean,
  inputRelativeY = 0
) => {
  if (cloneMap.has(componentEl) === shouldRelocate) {
    return;
  }

  if (shouldRelocate) {
    addClone(componentEl, inputEl, inputRelativeY);
  } else {
    removeClone(componentEl, inputEl);
  }
};

export const isFocused = (input: HTMLInputElement | HTMLTextAreaElement): boolean => {
  return input === (input as any).getRootNode().activeElement;
};

const addClone = (componentEl: HTMLElement, inputEl: HTMLInputElement | HTMLTextAreaElement, inputRelativeY: number) => {
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
  clonedEl.classList.add('cloned-input');
  clonedEl.tabIndex = -1;
  parentEl.appendChild(clonedEl);
  cloneMap.set(componentEl, clonedEl);

  const doc = componentEl.ownerDocument!;
  const tx = doc.dir === 'rtl' ? 9999 : -9999;
  componentEl.style.pointerEvents = 'none';
  inputEl.style.transform = `translate3d(${tx}px,${inputRelativeY}px,0) scale(0)`;
};

const removeClone = (componentEl: HTMLElement, inputEl: HTMLElement) => {
  const clone = cloneMap.get(componentEl);
  if (clone) {
    cloneMap.delete(componentEl);
    clone.remove();
  }
  componentEl.style.pointerEvents = '';
  inputEl.style.transform = '';
};
