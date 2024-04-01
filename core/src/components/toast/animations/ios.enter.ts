import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ToastPresentOptions } from '../toast-interface';

import { getOffsetForMiddlePosition } from './utils';

/**
 * iOS Toast Enter Animation
 */
export const iosEnterAnimation = (
  baseEl: HTMLElement,
  opts: ToastPresentOptions
): Animation => {
  const baseAnimation =
    createAnimation();
  const wrapperAnimation =
    createAnimation();
  const { position, top, bottom } =
    opts;

  const root = getElementRoot(baseEl);
  const wrapperEl = root.querySelector(
    '.toast-wrapper'
  ) as HTMLElement;

  wrapperAnimation.addElement(
    wrapperEl
  );

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo(
        'transform',
        'translateY(-100%)',
        `translateY(${top})`
      );
      break;
    case 'middle':
      const topPosition =
        getOffsetForMiddlePosition(
          baseEl.clientHeight,
          wrapperEl.clientHeight
        );
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo(
        'opacity',
        0.01,
        1
      );
      break;
    default:
      wrapperAnimation.fromTo(
        'transform',
        'translateY(100%)',
        `translateY(${bottom})`
      );
      break;
  }
  return baseAnimation
    .easing(
      'cubic-bezier(.155,1.105,.295,1.12)'
    )
    .duration(400)
    .addAnimation(wrapperAnimation);
};
