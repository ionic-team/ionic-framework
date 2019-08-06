
const SKIP_SELECTOR = 'input, textarea, [no-blur]';

export const enableInputBlurring = () => {
  let focused = true;
  let didScroll = false;

  const doc = document;
  const onScroll = () => {
    didScroll = true;
  };

  const onFocusin = () => {
    focused = true;
  };

  const onTouchend = (ev: any) => {
    // if app did scroll return early
    if (didScroll) {
      didScroll = false;
      return;
    }
    const active = doc.activeElement as HTMLElement | null;
    if (!active) {
      return;
    }

    // only blur if the active element is a text-input or a textarea
    if (active.matches(SKIP_SELECTOR)) {
      return;
    }

    // if the selected target is the active element, do not blur
    const tapped = ev.target as HTMLElement;
    if (tapped === active) {
      return;
    }
    if (tapped.matches(SKIP_SELECTOR) || tapped.closest(SKIP_SELECTOR)) {
      return;
    }

    focused = false;
    // TODO: find a better way, why 50ms?
    setTimeout(() => {
      if (!focused) {
        active.blur();
      }
    }, 50);
  };

  doc.addEventListener('ionScrollStart', onScroll);
  doc.addEventListener('focusin', onFocusin, true);
  doc.addEventListener('touchend', onTouchend, false);

  return () => {
    doc.removeEventListener('ionScrollStart', onScroll, true);
    doc.removeEventListener('focusin', onFocusin, true);
    doc.removeEventListener('touchend', onTouchend, false);
  };
};
