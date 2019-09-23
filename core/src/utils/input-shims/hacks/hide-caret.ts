import { isFocused, relocateInput } from './common';

const CARET_COLOR = 'caret-color';
export const enableHideCaretOnScroll = (componentEl: HTMLElement, inputEl: HTMLInputElement | HTMLTextAreaElement | undefined, scrollEl: HTMLIonContentElement | undefined) => {
  if (!scrollEl || !inputEl) {
    return () => { return; };
  }

  const supportsCaretColor = CSS.supports(CARET_COLOR, 'red');

  const scrollHideCaret = (shouldHideCaret: boolean) => {
    if (isFocused(inputEl)) {
      hideCaret(shouldHideCaret);
    }
  };

  const hideCaret = (shouldHideCaret: boolean) => {
    if (supportsCaretColor) {
      requestAnimationFrame(() => {
        if (shouldHideCaret) {
          inputEl.style.setProperty('background', 'black');
          inputEl.style.setProperty(CARET_COLOR, 'transparent');
        } else {
          inputEl.style.removeProperty('background');
          inputEl.style.removeProperty(CARET_COLOR);
        }
      });
    } else {
      relocateInput(componentEl, inputEl, shouldHideCaret);
    }
  };

  const scrollStart = () => scrollHideCaret(true);
  const scrollEnd = () => scrollHideCaret(false);
  const onBlur = () => hideCaret(false);

  scrollEl.addEventListener('ionScrollStart', scrollStart);
  scrollEl.addEventListener('ionScrollEnd', scrollEnd);
  inputEl.addEventListener('blur', onBlur);

  return () => {
    scrollEl.removeEventListener('ionScrollStart', scrollStart);
    scrollEl.removeEventListener('ionScrollEnd', scrollEnd);
    inputEl.addEventListener('ionBlur', onBlur);
  };
};
