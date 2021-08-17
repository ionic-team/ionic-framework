import { Config } from '../../interface';
import { componentOnReady } from '../helpers';

import { enableHideCaretOnScroll } from './hacks/hide-caret';
import { enableInputBlurring } from './hacks/input-blurring';
import { enableScrollAssist } from './hacks/scroll-assist';
import { enableScrollPadding } from './hacks/scroll-padding';

const INPUT_BLURRING = true;
const SCROLL_ASSIST = true;
const SCROLL_PADDING = true;
const HIDE_CARET = true;

export const startInputShims = (config: Config) => {
  const doc = document;
  const keyboardHeight = config.getNumber('keyboardHeight', 290);
  const scrollAssist = config.getBoolean('scrollAssist', true);
  const hideCaret = config.getBoolean('hideCaretOnScroll', true);
  const inputBlurring = config.getBoolean('inputBlurring', true);
  const scrollPadding = config.getBoolean('scrollPadding', true);
  const inputs = Array.from(doc.querySelectorAll('ion-input, ion-textarea')) as HTMLElement[];

  const hideCaretMap = new WeakMap<HTMLElement, () => void>();
  const scrollAssistMap = new WeakMap<HTMLElement, () => void>();

  const registerInput = async (componentEl: HTMLElement) => {
    await new Promise(resolve => componentOnReady(componentEl, resolve));

    const inputRoot = componentEl.shadowRoot || componentEl;
    const inputEl = inputRoot.querySelector('input') || inputRoot.querySelector('textarea');
    const scrollEl = componentEl.closest('ion-content');
    const footerEl = (!scrollEl) ? componentEl.closest('ion-footer') as HTMLIonFooterElement | null : null;

    if (!inputEl) {
      return;
    }

    if (HIDE_CARET && !!scrollEl && hideCaret && !hideCaretMap.has(componentEl)) {
      const rmFn = enableHideCaretOnScroll(componentEl, inputEl, scrollEl);
      hideCaretMap.set(componentEl, rmFn);
    }

    if (SCROLL_ASSIST && (!!scrollEl || !!footerEl) && scrollAssist && !scrollAssistMap.has(componentEl)) {
      const rmFn = enableScrollAssist(componentEl, inputEl, scrollEl, footerEl, keyboardHeight);
      scrollAssistMap.set(componentEl, rmFn);
    }
  };

  const unregisterInput = (componentEl: HTMLElement) => {
    if (HIDE_CARET && hideCaret) {
      const fn = hideCaretMap.get(componentEl);
      if (fn) {
        fn();
      }
      hideCaretMap.delete(componentEl);
    }

    if (SCROLL_ASSIST && scrollAssist) {
      const fn = scrollAssistMap.get(componentEl);
      if (fn) {
        fn();
      }
      scrollAssistMap.delete(componentEl);
    }
  };

  if (inputBlurring && INPUT_BLURRING) {
    enableInputBlurring();
  }

  if (scrollPadding && SCROLL_PADDING) {
    enableScrollPadding(keyboardHeight);
  }

  // Input might be already loaded in the DOM before ion-device-hacks did.
  // At this point we need to look for all of the inputs not registered yet
  // and register them.
  for (const input of inputs) {
    registerInput(input);
  }

  doc.addEventListener('ionInputDidLoad', ((ev: InputEvent) => {
    registerInput(ev.detail);
  }) as any);

  doc.addEventListener('ionInputDidUnload', ((ev: InputEvent) => {
    unregisterInput(ev.detail);
  }) as any);
};

type InputEvent = CustomEvent<HTMLElement>;
