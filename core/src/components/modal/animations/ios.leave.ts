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
    .fromTo('transform', 'translateY(0%)', 'translateY(100%)');

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(duration)
    .addAnimation([backdropAnimation, wrapperAnimation]);

  if (presentingEl) {
    const modalTransform = (presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined) ? '-10px' : 'max(30px, var(--ion-safe-area-top))';
    const bodyEl = document.body;
    const currentPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const presentingAnimation = createAnimation()
      .addElement(presentingEl)
      .beforeClearStyles(['transform'])
      .afterClearStyles(['transform'])
      .onFinish(currentStep => {
        // only reset background color if this is the last card-style modal
        if (currentStep !== 1) { return; }

        presentingEl.style.setProperty('overflow', '');

        const numModals = Array.from(bodyEl.querySelectorAll('ion-modal')).filter(m => m.presentingElement !== undefined).length;
        if (numModals <= 1) {
          bodyEl.style.setProperty('background-color', '');
        }
      })
      .keyframes([
        { offset: 0, filter: 'contrast(0.85)', transform: `translateY(${modalTransform}) scale(${currentPresentingScale})`, borderRadius: '10px 10px 0 0' },
        { offset: 1, filter: 'contrast(1)', transform: 'translateY(0px) scale(1)', borderRadius: '0px' }
      ]);

    baseAnimation.addAnimation(presentingAnimation);
  }

  return baseAnimation;
};
