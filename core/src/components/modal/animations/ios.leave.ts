import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Leave Animation
 */
export const iosLeaveAnimation = (
  baseEl: HTMLElement,
  presentingEl?: HTMLElement,
  duration = 500
  ): IonicAnimation => {

  const backdropAnimation = createAnimation()
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.4, 0.0);

  const wrapperAnimation = createAnimation()
    .addElement(baseEl.querySelector('.modal-wrapper'))
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', `translateY(0%)`, 'translateY(100%)');

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(duration)
    .addAnimation([backdropAnimation, wrapperAnimation]);

  if (presentingEl) {
    const currentPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const presentingFromY = SwipeToCloseDefaults.MIN_PRESENTING_Y;
    const bodyEl = document.body;
    const bodyAnimation = createAnimation()
      .addElement(bodyEl)
      .afterClearStyles(['background-color']);

    const presentingAnimation = createAnimation()
      .addElement(presentingEl)
      .beforeClearStyles(['transform'])
      .duration(duration)
      .fromTo('transform', `translateY(${presentingFromY}px) scale(${currentPresentingScale})`, 'translateY(0px) scale(1)')

    baseAnimation.addAnimation([bodyAnimation, presentingAnimation]);
  }
  return baseAnimation;
};
