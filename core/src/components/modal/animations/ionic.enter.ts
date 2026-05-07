import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ModalAnimationOptions } from '../modal-interface';

import { createSheetEnterAnimation } from './sheet';

const createEnterAnimation = () => {
  const backdropAnimation = createAnimation()
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none',
    })
    .afterClearStyles(['pointer-events']);

  const wrapperAnimation = createAnimation().keyframes([
    { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
    { offset: 1, opacity: 1, transform: `translateY(0px)` },
  ]);

  return { backdropAnimation, wrapperAnimation, contentAnimation: undefined };
};

/**
 * Ionic Modal Enter Animation
 */
export const ionicEnterAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions): Animation => {
  const { currentBreakpoint, expandToScroll } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation, contentAnimation } =
    currentBreakpoint !== undefined ? createSheetEnterAnimation(opts) : createEnterAnimation();

  backdropAnimation.addElement(root.querySelector('ion-backdrop')!);

  wrapperAnimation.addElement(root.querySelector('.modal-wrapper')!);

  // The content animation is only added if scrolling is enabled for
  // all the breakpoints.
  !expandToScroll && contentAnimation?.addElement(baseEl.querySelector('.ion-page')!);

  backdropAnimation.duration(300).easing('ease-out');
  wrapperAnimation.duration(400).easing('cubic-bezier(0.32, 0.68, 0, 1)');
  contentAnimation?.duration(400).easing('cubic-bezier(0.32, 0.68, 0, 1)');

  const baseAnimation = createAnimation().addElement(baseEl).addAnimation([backdropAnimation, wrapperAnimation]);

  if (contentAnimation) {
    baseAnimation.addAnimation(contentAnimation);
  }

  return baseAnimation;
};
