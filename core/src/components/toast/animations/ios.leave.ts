import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';

/**
 * iOS Toast Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement, position: string): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  const root = getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper') as HTMLElement;

  wrapperAnimation.addElement(wrapperEl);

  /**
   * For top/bottom positions, we use to() instead of fromTo() so that if
   * the positionAnchor prop was used, we don't need to recalculate the
   * toast and/or anchor's position and duplicate work from the enter
   * animation.
   */
  switch (position) {
    case 'top':
      wrapperAnimation.to('transform', 'translateY(-100%)');
      break;
    case 'middle':
      wrapperAnimation.fromTo('opacity', 0.99, 0);
      break;
    default:
      wrapperAnimation.to('transform', 'translateY(100%)');
      break;
  }
  return baseAnimation.easing('cubic-bezier(.36,.66,.04,1)').duration(300).addAnimation(wrapperAnimation);
};
