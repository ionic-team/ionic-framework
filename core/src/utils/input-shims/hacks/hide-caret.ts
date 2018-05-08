import { isFocused, relocateInput } from './common';


export function enableHideCaretOnScroll(componentEl: HTMLElement, inputEl: HTMLInputElement, scrollEl: HTMLIonScrollElement) {
  if (!scrollEl || !inputEl) {
    return () => { return; };
  }
  console.debug('Input: enableHideCaretOnScroll');

  const scrollHideCaret = (shouldHideCaret: boolean) => {
    // console.log('scrollHideCaret', shouldHideCaret)
    if (isFocused(inputEl)) {
      relocateInput(componentEl, inputEl, shouldHideCaret);
    }
  };

  const onBlur = () => relocateInput(componentEl, inputEl, false);
  const hideCaret = () => scrollHideCaret(true);
  const showCaret = () => scrollHideCaret(false);

  scrollEl && scrollEl.addEventListener('ionScrollStart', hideCaret);
  scrollEl && scrollEl.addEventListener('ionScrollEnd', showCaret);
  inputEl.addEventListener('blur', onBlur);

  return () => {
    scrollEl.removeEventListener('ionScrollStart', hideCaret);
    scrollEl.removeEventListener('ionScrollEnd', showCaret);
    inputEl.addEventListener('ionBlur', onBlur);
  };
}
