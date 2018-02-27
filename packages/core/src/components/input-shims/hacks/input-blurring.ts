import { App } from '../../..';

const SKIP_BLURRING = ['INPUT', 'TEXTAREA', 'ION-INPUT', 'ION-TEXTAREA'];

export default function enableInputBlurring(app: App) {
  console.debug('Input: enableInputBlurring');

  let focused = true;

  function onFocusin() {
    focused = true;
  }

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

  document.addEventListener('focusin', onFocusin, true);
  document.addEventListener('touchend', onTouchend, false);

  return () => {
    document.removeEventListener('focusin', onFocusin, true);
    document.removeEventListener('touchend', onTouchend, false);
  };
}
