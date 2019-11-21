import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Leave Animation
 */
export const iosLeaveAnimation = (
  baseEl: HTMLElement,
  presentingEl?: HTMLElement,
  duration = 500
  ): Animation => {

  const backdropAnimation = createAnimation()
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', 'var(--backdrop-opacity)', 0.0);

  const wrapperAnimation = createAnimation()
    .addElement(baseEl.querySelector('.modal-wrapper')!)
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
    const presentingAnimation = createAnimation()
      .addElement(presentingEl)
      .beforeClearStyles(['transform'])
      .onFinish(currentStep => {
        if (currentStep === 1) {
          presentingEl.style.removeProperty('border-radius');
        }
      })
      .duration(duration)
      .fromTo('transform', `translateY(${presentingFromY}px) scale(${currentPresentingScale})`, 'translateY(0px) scale(1)');

    baseAnimation.addAnimation(presentingAnimation);
  }

  return baseAnimation;
};
