import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ModalAnimationOptions } from '../modal-interface';

import { createSheetLeaveAnimation } from './sheet';

const createLeaveAnimation = () => {
  const backdropAnimation =
    createAnimation().fromTo(
      'opacity',
      'var(--backdrop-opacity)',
      0
    );

  const wrapperAnimation =
    createAnimation().keyframes([
      {
        offset: 0,
        opacity: 0.99,
        transform: `translateY(0px)`,
      },
      {
        offset: 1,
        opacity: 0,
        transform: 'translateY(40px)',
      },
    ]);

  return {
    backdropAnimation,
    wrapperAnimation,
  };
};

/**
 * Md Modal Leave Animation
 */
export const mdLeaveAnimation = (
  baseEl: HTMLElement,
  opts: ModalAnimationOptions
): Animation => {
  const { currentBreakpoint } = opts;
  const root = getElementRoot(baseEl);
  const {
    wrapperAnimation,
    backdropAnimation,
  } =
    currentBreakpoint !== undefined
      ? createSheetLeaveAnimation(opts)
      : createLeaveAnimation();

  backdropAnimation.addElement(
    root.querySelector('ion-backdrop')!
  );
  wrapperAnimation.addElement(
    root.querySelector(
      '.modal-wrapper'
    )!
  );

  return createAnimation()
    .easing(
      'cubic-bezier(0.47,0,0.745,0.715)'
    )
    .duration(200)
    .addAnimation([
      backdropAnimation,
      wrapperAnimation,
    ]);
};
