import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type {
  Animation,
  ToastDismissOptions,
} from '../../../interface';

/**
 * iOS Toast Leave Animation
 */
export const iosLeaveAnimation = (
  baseEl: HTMLElement,
  opts: ToastDismissOptions
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
        `translateY(${top})`,
        'translateY(-100%)'
      );
      break;
    case 'middle':
      wrapperAnimation.fromTo(
        'opacity',
        0.99,
        0
      );
      break;
    default:
      wrapperAnimation.fromTo(
        'transform',
        `translateY(${bottom})`,
        'translateY(100%)'
      );
      break;
  }
  return baseAnimation
    .easing(
      'cubic-bezier(.36,.66,.04,1)'
    )
    .duration(300)
    .addAnimation(wrapperAnimation);
};
