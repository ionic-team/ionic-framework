import { isFocused, relocateInput } from './common';

export const enableHideCaretOnScroll = (componentEl: HTMLElement, inputEl: HTMLInputElement | HTMLTextAreaElement | undefined, scrollEl: HTMLIonContentElement | undefined) => {
  if (!scrollEl || !inputEl) {
    return () => { return; };
  }

  const scrollHideCaret = (shouldHideCaret: boolean) => {
    if (isFocused(inputEl)) {
      relocateInput(componentEl, inputEl, shouldHideCaret);
    }
  };

  const onBlur = () => relocateInput(componentEl, inputEl, false);
  const hideCaret = () => scrollHideCaret(true);
  const showCaret = () => scrollHideCaret(false);

  scrollEl.addEventListener('ionScrollStart', hideCaret);
  scrollEl.addEventListener('ionScrollEnd', showCaret);
  inputEl.addEventListener('blur', onBlur);

  return () => {
    scrollEl.removeEventListener('ionScrollStart', hideCaret);
    scrollEl.removeEventListener('ionScrollEnd', showCaret);
    inputEl.addEventListener('ionBlur', onBlur);
  };
};
