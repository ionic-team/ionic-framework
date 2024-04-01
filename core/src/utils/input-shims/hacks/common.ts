const cloneMap = new WeakMap<
  HTMLElement,
  HTMLElement
>();

export const relocateInput = (
  componentEl: HTMLElement,
  inputEl:
    | HTMLInputElement
    | HTMLTextAreaElement,
  shouldRelocate: boolean,
  inputRelativeY = 0,
  disabledClonedInput = false
) => {
  if (
    cloneMap.has(componentEl) ===
    shouldRelocate
  ) {
    return;
  }

  if (shouldRelocate) {
    addClone(
      componentEl,
      inputEl,
      inputRelativeY,
      disabledClonedInput
    );
  } else {
    removeClone(componentEl, inputEl);
  }
};

export const isFocused = (
  input:
    | HTMLInputElement
    | HTMLTextAreaElement
): boolean => {
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode
   * Calling getRootNode on an element in standard web page will return HTMLDocument.
   * Calling getRootNode on an element inside of the Shadow DOM will return the associated ShadowRoot.
   * Calling getRootNode on an element that is not attached to a document/shadow tree will return
   * the root of the DOM tree it belongs to.
   * isFocused is used for the hide-caret utility which only considers input/textarea elements
   * that are present in the DOM, so we don't set types for that final case since it does not apply.
   */
  return (
    input ===
    (
      input.getRootNode() as
        | HTMLDocument
        | ShadowRoot
    ).activeElement
  );
};

const addClone = (
  componentEl: HTMLElement,
  inputEl:
    | HTMLInputElement
    | HTMLTextAreaElement,
  inputRelativeY: number,
  disabledClonedInput = false
) => {
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
  const clonedEl = inputEl.cloneNode(
    false
  ) as
    | HTMLInputElement
    | HTMLTextAreaElement;
  clonedEl.classList.add(
    'cloned-input'
  );
  clonedEl.tabIndex = -1;

  /**
   * Making the cloned input disabled prevents
   * Chrome for Android from still scrolling
   * the entire page since this cloned input
   * will briefly be hidden by the keyboard
   * even though it is not focused.
   *
   * This is not needed on iOS. While this
   * does not cause functional issues on iOS,
   * the input still appears slightly dimmed even
   * if we set opacity: 1.
   */
  if (disabledClonedInput) {
    clonedEl.disabled = true;
  }
  parentEl.appendChild(clonedEl);
  cloneMap.set(componentEl, clonedEl);

  const doc =
    componentEl.ownerDocument!;
  const tx =
    doc.dir === 'rtl' ? 9999 : -9999;
  componentEl.style.pointerEvents =
    'none';
  inputEl.style.transform = `translate3d(${tx}px,${inputRelativeY}px,0) scale(0)`;
};

const removeClone = (
  componentEl: HTMLElement,
  inputEl: HTMLElement
) => {
  const clone = cloneMap.get(
    componentEl
  );
  if (clone) {
    cloneMap.delete(componentEl);
    clone.remove();
  }
  componentEl.style.pointerEvents = '';
  inputEl.style.transform = '';
};

/**
 * Factoring in 50px gives us some room
 * in case the keyboard shows password/autofill bars
 * asynchronously.
 */
export const SCROLL_AMOUNT_PADDING = 50;
