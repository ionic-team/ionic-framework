const PADDING_TIMER_KEY = '$ionPaddingTimer';

export default function enableScrollPadding(keyboardHeight: number) {
  console.debug('Input: enableScrollPadding');

  function onFocusin(ev: any) {
    setScrollPadding(ev.target, keyboardHeight);
  }
  function onFocusout(ev: any) {
    setScrollPadding(ev.target, 0);
  }

  document.addEventListener('focusin', onFocusin);
  document.addEventListener('focusout', onFocusout);

  return () => {
    document.removeEventListener('focusin', onFocusin);
    document.removeEventListener('focusout', onFocusout);
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
