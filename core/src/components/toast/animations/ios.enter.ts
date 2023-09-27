import { createAnimation } from '@utils/animation/animation';
import { win } from '@utils/browser';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ToastPresentOptions } from '../toast-interface';

/**
 * iOS Toast Enter Animation
 */
export const iosEnterAnimation = (baseEl: HTMLElement, opts: ToastPresentOptions): Animation => {
  const baseAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  const { position, positionAnchor } = opts;

  const root = getElementRoot(baseEl);
  const wrapperEl = root.querySelector('.toast-wrapper') as HTMLElement;

  /**
   * Start with a predefined offset from the edge the toast will be
   * positioned relative to. By default, this will be the top edge
   * of the screen.
   */
  let offset = position === 'top' ? 10 : -10;
  let top, bottom;

  /**
   * If positionAnchor is defined, add in the distance from the top
   * of the screen to the target anchor edge. For position="top", the
   * bottom anchor edge is targeted. For position="bottom", the top
   * anchor edge is targeted.
   */
  if (positionAnchor && win) {
    const box = positionAnchor.getBoundingClientRect();
    if (position === 'top') {
      offset += box.bottom;
    } else if (position === 'bottom') {
      /**
       * Just box.top is the distance from the top edge of the screen
       * to the top edge of the anchor. We want to calculate from the
       * bottom edge of the screen instead.
       */
      offset -= (win.innerHeight - box.top);
    }

    /**
     * We don't include safe area here because that should already be
     * accounted for when checking the position of the anchor.
     */
    top = `${offset}px`;
    bottom = `${offset}px`;
  } else {
    top = `calc(${offset}px + var(--ion-safe-area-top, 0px))`;
    bottom = `calc(${offset}px - var(--ion-safe-area-bottom, 0px))`;
  }

  wrapperAnimation.addElement(wrapperEl);

  switch (position) {
    case 'top':
      wrapperAnimation.fromTo('transform', 'translateY(-100%)', `translateY(${top})`);
      break;
    case 'middle':
      const topPosition = Math.floor(baseEl.clientHeight / 2 - wrapperEl.clientHeight / 2);
      wrapperEl.style.top = `${topPosition}px`;
      wrapperAnimation.fromTo('opacity', 0.01, 1);
      break;
    default:
      wrapperAnimation.fromTo('transform', 'translateY(100%)', `translateY(${bottom})`);
      break;
  }
  return baseAnimation.easing('cubic-bezier(.155,1.105,.295,1.12)').duration(400).addAnimation(wrapperAnimation);
};
