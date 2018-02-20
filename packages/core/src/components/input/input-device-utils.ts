import { assert } from "../../utils/helpers";
import { CSS_PROP } from "../animation-controller/constants";
import { App } from "../..";

const SCROLL_DATA_MAP = new WeakMap<HTMLElement, ScrollData>();
const SCROLL_ASSIST_SPEED = 0.3;

export interface ScrollData {
  scrollAmount: number;
  scrollPadding: number;
  scrollDuration: number;
}

export function calcScrollData(
  inputRect: ClientRect,
  contentRect: ClientRect,
  keyboardHeight: number,
  plaformHeight: number
): ScrollData {
  // compute input's Y values relative to the body
  const inputTop = inputRect.top;
  const inputBottom = inputRect.bottom;

  // compute safe area
  const safeAreaTop = contentRect.top;
  const safeAreaBottom = Math.min(contentRect.bottom, plaformHeight - keyboardHeight);

  // figure out if each edge of teh input is within the safe area
  const distanceToBottom = safeAreaBottom - inputBottom;
  const distanceToTop = safeAreaTop - inputTop;

  const scrollAmount = Math.round((distanceToBottom < 0 )
    ? distanceToBottom
    : (distanceToTop < 0 )
    ? distanceToTop
    : 0);

  const distance = Math.abs(scrollAmount);
  const duration = distance / SCROLL_ASSIST_SPEED;
  const scrollDuration = Math.min(400, Math.max(150, duration));

  return  {
    scrollAmount,
    scrollDuration,
    scrollPadding: 0,
  };
}

function getScrollData(componentEl: HTMLElement, contentEl: HTMLElement, keyboardHeight: number): ScrollData {
  if (!contentEl) {
    return {
      scrollAmount: 0,
      scrollPadding: 0,
      scrollDuration: 0,
    };
  }
  const scrollData = SCROLL_DATA_MAP.get(componentEl);
  if (scrollData) {
    return scrollData;
  }
  const ele = <HTMLElement>componentEl.closest('ion-item,[ion-item]') || componentEl;
  const newScrollData = calcScrollData(
    ele.getBoundingClientRect(),
    contentEl.getBoundingClientRect(),
    keyboardHeight,
    window.innerHeight
  );
  SCROLL_DATA_MAP.set(componentEl, newScrollData);
  return newScrollData;
}

export function enableScrollPadding(_componentEl: HTMLElement, inputEl: HTMLElement, _contentEl: HTMLElement, _keyboardHeight: number) {
  console.debug('Input: enableScrollPadding');

  const onFocus = () => {
    // const scrollPadding = getScrollData(componentEl, contentEl, keyboardHeight).scrollPadding;
    // content.addScrollPadding(scrollPadding);
    // content.clearScrollPaddingFocusOut();
  };
  inputEl.addEventListener('focus', onFocus);

  return () => {
    inputEl.removeEventListener('focus', onFocus);
  }
}

export function enableScrollMove(
  componentEl: HTMLElement,
  contentEl: HTMLIonContentElement,
  keyboardHeight: number
) {
  console.debug('Input: enableAutoScroll');
  this.ionFocus.subscribe(() => {
    const scrollData = getScrollData(componentEl, contentEl, keyboardHeight)
    if (Math.abs(scrollData.scrollAmount) > 4) {
      contentEl.scrollBy(0, scrollData.scrollAmount);
    }
  });
}

const SKIP_BLURRING = ['INPUT', 'TEXTAREA', 'ION-INPUT', 'ION-TEXTAREA'];

export function enableInputBlurring(app: App) {
  let focused = true;

  function onFocusin() {
    focused = true;
  }

  document.addEventListener('focusin', onFocusin, true);
  document.addEventListener('touchend', onTouchend, false);

  function onTouchend(ev: any) {
    // if app did scroll return early
    if (app.didScroll) {
      app.didScroll = false;
      return;
    }
    const active = document.activeElement as HTMLElement;
    if (!active) {
      return;
    }
    // only blur if the active element is a text-input or a textarea
    if (SKIP_BLURRING.indexOf(active.tagName) === -1) {
      return;
    }

    // if the selected target is the active element, do not blur
    const tapped = ev.target;
    if (tapped === active) {
      return;
    }
    if (SKIP_BLURRING.indexOf(tapped.tagName) >= 0) {
      return;
    }

    // skip if div is a cover
    if (tapped.classList.contains('input-cover')) {
      return;
    }

    focused = false;
    // TODO: find a better way, why 50ms?
    setTimeout(() => {
      if (!focused) {
        active.blur();
      }
    }, 50);
  }
  return () => {
    document.removeEventListener('focusin', onFocusin, true);
    document.removeEventListener('touchend', onTouchend, false);
  }
}

export function enableHideCaretOnScroll(componentEl: HTMLElement, inputEl: HTMLInputElement, scrollEl: HTMLIonScrollElement) {

  console.debug('Input: enableHideCaretOnScroll');

  function scrollHideCaret(shouldHideCaret: boolean) {
    if(isFocused(inputEl)) {
      relocateInput(componentEl, inputEl, shouldHideCaret);
    }
  }

  const onBlur = () => relocateInput(componentEl, inputEl, false);
  const hideCaret = () => scrollHideCaret(true);
  const showCaret = () => scrollHideCaret(false);

  scrollEl.addEventListener('ionScrollStart', hideCaret);
  scrollEl.addEventListener('ionScrollEnd',showCaret);
  inputEl.addEventListener('blur', onBlur);

  return () => {
    scrollEl.removeEventListener('ionScrollStart', hideCaret);
    scrollEl.removeEventListener('ionScrollEnd',showCaret);
    inputEl.addEventListener('ionBlur', onBlur);
  };
}


function removeClone(componentEl: HTMLElement, nativeInputEl: HTMLElement) {
  if (componentEl && componentEl.parentElement) {
    const clonedInputEles = componentEl.parentElement.querySelectorAll('.cloned-input');
    for (let i = 0; i < clonedInputEles.length; i++) {
      clonedInputEles[i].parentNode.removeChild(clonedInputEles[i]);
    }

    componentEl.style.pointerEvents = '';
  }
  (<any>nativeInputEl.style)[CSS_PROP.transformProp] = '';
  nativeInputEl.style.opacity = '';
}

function cloneInputComponent(componentEle: HTMLElement, nativeInputEle: HTMLInputElement) {
  // Make sure we kill all the clones before creating new ones
  // It is a defensive, removeClone() should do nothing
  // removeClone(plt, srcComponentEle, srcNativeInputEle);
  assert(componentEle.parentElement.querySelector('.cloned-input') === null, 'leaked cloned input');
  // given a native <input> or <textarea> element
  // find its parent wrapping component like <ion-input> or <ion-textarea>
  // then clone the entire component
  if (componentEle) {
    // DOM READ
    const srcTop = componentEle.offsetTop;
    const srcLeft = componentEle.offsetLeft;
    const srcWidth = componentEle.offsetWidth;
    const srcHeight = componentEle.offsetHeight;

    // DOM WRITE
    // not using deep clone so we don't pull in unnecessary nodes
    const clonedComponentEle = <HTMLElement>componentEle.cloneNode(false);
    const clonedStyle = clonedComponentEle.style;
    clonedComponentEle.classList.add('cloned-input');
    clonedComponentEle.setAttribute('aria-hidden', 'true');
    clonedStyle.pointerEvents = 'none';
    clonedStyle.position = 'absolute';
    clonedStyle.top = srcTop + 'px';
    clonedStyle.left = srcLeft + 'px';
    clonedStyle.width = srcWidth + 'px';
    clonedStyle.height = srcHeight + 'px';

    const clonedNativeInputEle = <HTMLInputElement>nativeInputEle.cloneNode(false);
    clonedNativeInputEle.value = nativeInputEle.value;
    clonedNativeInputEle.tabIndex = -1;

    clonedComponentEle.appendChild(clonedNativeInputEle);
    componentEle.parentNode.appendChild(clonedComponentEle);

    clonedComponentEle.style.pointerEvents = 'none';
  }

  (<any>nativeInputEle.style)[CSS_PROP.transformProp] = 'scale(0)';
}

function relocateInput(componentEl: HTMLElement, inputEle: HTMLInputElement, shouldRelocate: boolean) {

  if ((componentEl as any)['$ionRelocated'] === shouldRelocate) {
    return;
  }
  console.debug(`native-input, hideCaret, shouldHideCaret: ${shouldRelocate}, input value: ${inputEle.value}`);
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
    cloneInputComponent(componentEl, inputEle);
    const inputRelativeY = this._getScrollData().inputSafeY;
    // fix for #11817
    const tx = document.dir === 'rtl' ? 9999 : -9999;
    (inputEle.style as any)[CSS_PROP.transformProp] = `translate3d(${tx}px,${inputRelativeY}px,0)`;
    inputEle.style.opacity = '0';

  } else {
    removeClone(componentEl, inputEle);
  }
  (componentEl as any)['$ionRelocated'] = shouldRelocate;
}

function isFocused(input: HTMLInputElement): boolean {
  return input === document.activeElement;
}
