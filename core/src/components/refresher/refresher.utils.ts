import { writeTask } from '@stencil/core';

import { isPlatform } from '../../utils/platform';

export const setSpinnerOpacity = (spinner: HTMLElement, opacity: number) => {
  spinner.style.setProperty('opacity', opacity.toString());
};

export const handleScrollWhilePulling = (
  spinner: HTMLElement,
  ticks: NodeListOf<SVGElement>,
  opacity: number,
  currentTickToShow: number
) => {
  writeTask(() => {
    setSpinnerOpacity(spinner, opacity);
    ticks.forEach((el, i) => el.style.setProperty('opacity', (i <= currentTickToShow) ? '0.99' : '0'));
  });
};

export const handleScrollWhileRefreshing = (
  spinner: HTMLElement,
  lastVelocityY: number
) => {
  writeTask(() => {
    // If user pulls down quickly, the spinner should spin faster
    spinner.style.setProperty('--refreshing-rotation-duration', (lastVelocityY >= 1.0) ? '0.5s' : '2s');
    spinner.style.setProperty('opacity', '1');
  });
};

export const shouldUseNativeRefresher = (referenceEl: HTMLIonRefresherElement, mode: string) => {
  const pullingSpinner = referenceEl.querySelector('ion-refresher-content .refresher-pulling ion-spinner');
  const refreshingSpinner = referenceEl.querySelector('ion-refresher-content .refresher-refreshing ion-spinner');

  return (
    pullingSpinner !== null &&
    refreshingSpinner !== null &&
    mode === 'ios' &&
    isPlatform('mobile')
  );
};

export const translateElement = (el?: HTMLElement, value?: string) => {
  return new Promise(resolve => {
    if (!el) { return resolve(); }

    transitionEnd(el, resolve);

    writeTask(() => {
      el.style.setProperty('transition', '0.2s all ease-out');

      if (value === undefined) {
        el.style.removeProperty('transform');
      } else {
        el.style.setProperty('transform', `translate3d(0px, ${value}, 0px)`);
      }
    });
  });
};

const transitionEnd = (el: HTMLElement | null, callback: (ev?: TransitionEvent) => void) => {
  let unRegTrans: (() => void) | undefined;
  const opts: any = { passive: true };

  const unregister = () => {
    if (unRegTrans) {
      unRegTrans();
    }
  };

  const onTransitionEnd = (ev: Event) => {
    if (el === ev.target) {
      unregister();
      callback(ev as TransitionEvent);
    }
  };

  if (el) {
    el.addEventListener('webkitTransitionEnd', onTransitionEnd, opts);
    el.addEventListener('transitionend', onTransitionEnd, opts);

    unRegTrans = () => {
      el.removeEventListener('webkitTransitionEnd', onTransitionEnd, opts);
      el.removeEventListener('transitionend', onTransitionEnd, opts);
    };
  }

  return unregister;
};
