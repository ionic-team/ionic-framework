import { writeTask } from '@stencil/core';

import { createAnimation } from '../../';
import { isPlatform } from '../../utils/platform';

// MD Native Refresher
// -----------------------------
type RefresherAnimationType = 'scale' | 'translate';

export const getRefresherAnimationType = (contentEl: HTMLElement): RefresherAnimationType => {
  const previousSibling = contentEl.previousElementSibling;
  const hasHeader = previousSibling !== null && previousSibling.tagName === 'ION-HEADER';

  return hasHeader ? 'translate' : 'scale';
};

export const createPullingAnimation = (type: RefresherAnimationType, pullingSpinner: HTMLElement) => {
  return type === 'scale' ? createScaleAnimation(pullingSpinner) : createTranslateAnimation(pullingSpinner);
};

const createScaleAnimation = (pullingSpinner: HTMLElement) => {
  return createAnimation().addElement(pullingSpinner);
};

const createTranslateAnimation = (pullingRefresherIcon: HTMLElement) => {
  const height = pullingRefresherIcon.clientHeight;
  const spinner = pullingRefresherIcon.querySelector('ion-spinner') as HTMLElement;
  const circle = spinner!.shadowRoot!.querySelector('circle') as any;
  const baseAnimation = createAnimation()
    .duration(1000)
    .easing('ease-out');

  const circleInnerAnimation = createAnimation()
    .addElement(circle)
    .keyframes([
      { offset: 0, 'stroke-dasharray': '1px, 200px', 'stroke-dashoffset': '0px' },
      { offset: 0.5, 'stroke-dasharray': '100px, 200px', 'stroke-dashoffset': '-15px' },
      { offset: 1, 'stroke-dasharray': '100px, 200px', 'stroke-dashoffset': '-125px' }
    ]);

  const circleOuterAnimation = createAnimation()
    .addElement(spinner)
    .keyframes([
      { offset: 0, opacity: '0.3', transform: 'rotate(0deg)' },
      { offset: 0.45, opacity: '0.3' },
      { offset: 0.55, opacity: '1' },
      { offset: 1, opacity: '1', transform: 'rotate(360deg)' }
    ]);

  const spinnerAnimation = createAnimation()
    .addElement(pullingRefresherIcon)
    .keyframes([
      { offset: 0, transform: `translateY(-${height + 10}px)` },
      { offset: 1, transform: 'translateY(100px)' }
    ]);

  baseAnimation.addAnimation([circleInnerAnimation, circleOuterAnimation, spinnerAnimation]);

  return baseAnimation;
};

export const createSnapBackAnimation = (pullingRefresherIcon: HTMLElement) => {
  return createAnimation()
    .duration(125)
    .addElement(pullingRefresherIcon)
    .fromTo('transform', 'translateY(var(--ion-pulling-refresher-translate, 100px))', 'translateY(0px)');
};

// iOS Native Refresher
// -----------------------------

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

    ticks.forEach((el, i) => {
      el.style.setProperty('opacity', (i <= currentTickToShow) ? '0.99' : '0');
    });
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

export const translateElement = (el: HTMLElement, value?: string) => {
  return new Promise(resolve => {
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

// Utils
// -----------------------------

export const shouldUseNativeRefresher = (referenceEl: HTMLIonRefresherElement, mode: string) => {
  const pullingSpinner = referenceEl.querySelector('ion-refresher-content .refresher-pulling ion-spinner');
  const refreshingSpinner = referenceEl.querySelector('ion-refresher-content .refresher-refreshing ion-spinner');

  return (
    pullingSpinner !== null &&
    refreshingSpinner !== null &&
    (
      (mode === 'ios' && isPlatform('mobile') && referenceEl.contentId !== undefined) ||
      mode === 'md'
    )

  );
};
