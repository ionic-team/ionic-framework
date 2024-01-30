import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ToastPresentOptions } from '../toast-interface';

import { getOffsetForMiddlePosition } from './utils';

/**
 * MD Toast Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement, opts: ToastPresentOptions): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const { position, top, bottom } = opts;

  const root = getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper') as HTMLElement;

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperEl.style.setProperty('transform', `translateY(${top})`);
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    case 'middle':
      const topPosition = getOffsetForMiddlePosition(baseEl.clientHeight, wrapperEl.clientHeight);
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperEl.style.setProperty('transform', `translateY(${bottom})`);
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
  }
  return baseAnimation.easing('cubic-bezier(.36,.66,.04,1)').duration(400).addAnimation(wrapperAnimation);
};
