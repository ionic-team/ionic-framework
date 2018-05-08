
const SKIP_BLURRING = ['INPUT', 'TEXTAREA', 'ION-INPUT', 'ION-TEXTAREA'];

export function enableInputBlurring(doc: Document) {
  console.debug('Input: enableInputBlurring');

  let focused = true;
  let didScroll = false;

  function onScroll() {
    didScroll = true;
  }

  function onFocusin() {
    focused = true;
  }

  function onTouchend(ev: any) {
    // if app did scroll return early
    if (didScroll) {
      didScroll = false;
      return;
    }
    const active = doc.activeElement as HTMLElement;
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

  doc.addEventListener('ionScrollStart', onScroll);
  doc.addEventListener('focusin', onFocusin, true);
  doc.addEventListener('touchend', onTouchend, false);

  return () => {
    doc.removeEventListener('ionScrollStart', onScroll, true);
    doc.removeEventListener('focusin', onFocusin, true);
    doc.removeEventListener('touchend', onTouchend, false);
  };
}
