const RELOCATED_KEY = '$ionRelocated';

export function relocateInput(
  componentEl: HTMLElement,
  inputEl: HTMLInputElement,
  shouldRelocate: boolean,
  inputRelativeY = 0
) {
  if ((componentEl as any)[RELOCATED_KEY] === shouldRelocate) {
    return;
  }
  console.debug(`native-input, hideCaret, shouldHideCaret: ${shouldRelocate}, input value: ${inputEl.value}`);
  if (shouldRelocate) {
    // this allows for the actual input to receive the focus from
    // the user's touch event, but before it receives focus, it
    // moves the actual input to a location that will not screw
    // up the app's layout, and does not allow the native browser
    // to attempt to scroll the input into place (messing up headers/footers)
    // the cloned input fills the area of where native input should be
    // while the native input fakes out the browser by relocating itself
    // before it receives the actual focus event
    // We hide the focused input (with the visible caret) invisiable by making it scale(0),
    cloneInputComponent(componentEl, inputEl);
    const doc = componentEl.ownerDocument;
    const tx = doc.dir === 'rtl' ? 9999 : -9999;
    inputEl.style.transform = `translate3d(${tx}px,${inputRelativeY}px,0)`;
    // TODO
    // inputEle.style.opacity = '0';
  } else {
    removeClone(componentEl, inputEl);
  }
  (componentEl as any)[RELOCATED_KEY] = shouldRelocate;
}

export function isFocused(input: HTMLInputElement): boolean {
  return input === input.ownerDocument.activeElement;
}

function removeClone(componentEl: HTMLElement, inputEl: HTMLElement) {
  if (componentEl && componentEl.parentElement) {
    Array.from(componentEl.parentElement.querySelectorAll('.cloned-input'))
      .forEach(clon => clon.remove());

    componentEl.style.pointerEvents = '';
  }
  (inputEl.style as any)['transform'] = '';
  inputEl.style.opacity = '';
}

function cloneInputComponent(componentEl: HTMLElement, inputEl: HTMLInputElement) {
  // Make sure we kill all the clones before creating new ones
  // It is a defensive, removeClone() should do nothing
  // removeClone(plt, srcComponentEle, srcNativeInputEle);
  // given a native <input> or <textarea> element
  // find its parent wrapping component like <ion-input> or <ion-textarea>
  // then clone the entire component
  const parentElement = componentEl.parentElement;
  const doc = componentEl.ownerDocument;
  if (componentEl && parentElement) {
    // DOM READ
    const srcTop = componentEl.offsetTop;
    const srcLeft = componentEl.offsetLeft;
    const srcWidth = componentEl.offsetWidth;
    const srcHeight = componentEl.offsetHeight;

    // DOM WRITE
    // not using deep clone so we don't pull in unnecessary nodes
    const clonedComponentEle = doc.createElement('div');
    const clonedStyle = clonedComponentEle.style;
    clonedComponentEle.classList.add(...Array.from(componentEl.classList));
    clonedComponentEle.classList.add('cloned-input');
    clonedComponentEle.setAttribute('aria-hidden', 'true');
    clonedStyle.pointerEvents = 'none';
    clonedStyle.position = 'absolute';
    clonedStyle.top = srcTop + 'px';
    clonedStyle.left = srcLeft + 'px';
    clonedStyle.width = srcWidth + 'px';
    clonedStyle.height = srcHeight + 'px';

    const clonedInputEl = doc.createElement('input');
    clonedInputEl.classList.add(...Array.from(inputEl.classList));
    clonedInputEl.value = inputEl.value;
    clonedInputEl.type = inputEl.type;
    clonedInputEl.placeholder = inputEl.placeholder;

    clonedInputEl.tabIndex = -1;

    clonedComponentEle.appendChild(clonedInputEl);
    parentElement.appendChild(clonedComponentEle);

    componentEl.style.pointerEvents = 'none';
  }
  inputEl.style.transform = 'scale(0)';
}
