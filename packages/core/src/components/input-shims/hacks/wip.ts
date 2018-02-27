
// export function enableScrollPadding(componentEl: HTMLElement, inputEl: HTMLElement, contentEl: HTMLElement, keyboardHeight: number) {
//   console.debug('Input: enableScrollPadding');
//   debugger;
//   const onFocus = () => {
//     const scrollPadding = getScrollData(componentEl, contentEl, keyboardHeight).scrollPadding;
//     contentEl.addScrollPadding(scrollPadding);
//     content.clearScrollPaddingFocusOut();
//   };
//   inputEl.addEventListener('focus', onFocus);

//   return () => {
//     inputEl.removeEventListener('focus', onFocus);
//   };
// }

// export function enableScrollMove(
//   componentEl: HTMLElement,
//   inputEl: HTMLElement,
//   contentEl: HTMLIonContentElement,
//   keyboardHeight: number
// ) {
//   console.debug('Input: enableAutoScroll');
//   const onFocus = () => {
//     const scrollData = getScrollData(componentEl, contentEl, keyboardHeight);
//     if (Math.abs(scrollData.scrollAmount) > 4) {
//       contentEl.scrollBy(0, scrollData.scrollAmount);
//     }
//   };

//   inputEl.addEventListener('focus', onFocus);
//   return () => {
//     inputEl.removeEventListener('focus', onFocus);
//   };
// }