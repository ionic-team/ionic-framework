import { createAnimation } from '@utils/animation/animation';

import type { Animation } from '../../../interface';

/**
 * iOS Action Sheet Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement): Animation => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const EASING = 'cubic-bezier(.36,.66,.04,1)';

  /**
   * We apply the easing curve to the 0th keyframe
   * instead of on the effect as a whole to avoid https://bugs.webkit.org/show_bug.cgi?id=241020
   * This bug is most noticeable on animations that slide off the screen.
   */
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop')!).keyframes([
    { offset: 0, opacity: 'var(--backdrop-opacity)', easing: EASING },
    { offset: 1, opacity: 0 },
  ]);

  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper')!).keyframes([
    { offset: 0, transform: 'translateY(0%)', easing: EASING },
    { offset: 1, transform: 'translateY(100%)' },
  ]);

  return baseAnimation.addElement(baseEl).duration(450).addAnimation([backdropAnimation, wrapperAnimation]);
};
