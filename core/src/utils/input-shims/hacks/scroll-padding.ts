const PADDING_TIMER_KEY = '$ionPaddingTimer';

export function enableScrollPadding(doc: Document, keyboardHeight: number) {
  console.debug('Input: enableScrollPadding');

  function onFocusin(ev: any) {
    setScrollPadding(ev.target, keyboardHeight);
  }
  function onFocusout(ev: any) {
    setScrollPadding(ev.target, 0);
  }

  doc.addEventListener('focusin', onFocusin);
  doc.addEventListener('focusout', onFocusout);

  return () => {
    doc.removeEventListener('focusin', onFocusin);
    doc.removeEventListener('focusout', onFocusout);
  };
}

function setScrollPadding(input: HTMLElement, keyboardHeight: number) {
  if (input.tagName !== 'INPUT') {
    return;
  }
  if (input.parentElement && input.parentElement.tagName === 'ION-INPUT') {
    return;
  }
  const el = input.closest('.scroll-inner') as HTMLElement;
  if (!el) {
    return;
  }
  const timer = (el as any)[PADDING_TIMER_KEY];
  if (timer) {
    clearTimeout(timer);
  }

  if (keyboardHeight > 0) {
    el.style.paddingBottom = keyboardHeight + 'px';
  } else {
    (el as any)[PADDING_TIMER_KEY] = setTimeout(() => {
      el.style.paddingBottom = '';
    }, 120);
  }
}
