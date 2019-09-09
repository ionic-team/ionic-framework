import { IonicAnimation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export const iosEnterAnimation = (
    baseEl: HTMLElement,
    presentingEl?: HTMLElement,
  ): IonicAnimation => {
  // The top translate Y for the presenting element
  const backdropAnimation = createAnimation()
    .addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 0.4);

  const wrapperAnimation = createAnimation()
    .addElement(baseEl.querySelector('.modal-wrapper'))
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(500)
    .beforeAddClass('show-modal')
    .addAnimation([backdropAnimation, wrapperAnimation]);

  if (presentingEl) {
    const bodyEl = document.body;
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const presentingToY = SwipeToCloseDefaults.MIN_PRESENTING_Y;
    const finalTransform = `translateY(${presentingToY}%) scale(${toPresentingScale})`;
    const presentingAnimation = createAnimation()
      .beforeStyles({
        'transform': 'translateY(0)',
        'border-radius': '10px 10px 0 0'
      })
      .afterStyles({
        'transform': finalTransform
      })
      .addElement(presentingEl)
      .duration(500)
      .fromTo('transform', 'translateY(0px) scale(1)', finalTransform);

    // Wrap around animation code
    bodyEl.style.backgroundColor = 'black';
    baseAnimation.addAnimation(presentingAnimation);
  }
  return baseAnimation;
};
