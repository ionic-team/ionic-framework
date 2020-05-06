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
    .addElement(baseEl.querySelectorAll('.modal-wrapper, .modal-shadow')!)
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', 'translateY(0vh)', 'translateY(100vh)');

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(duration)
    .addAnimation(wrapperAnimation);

  if (presentingEl) {
    const isMobile = window.innerWidth < 768;
    const hasCardModal = (presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined);

    const presentingAnimation = createAnimation()
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
      });

    const bodyEl = document.body;

    if (isMobile) {
      const transformOffset = (!CSS.supports('width', 'max(0px, 1px)')) ? '30px' : 'max(30px, var(--ion-safe-area-top))';
      const modalTransform = hasCardModal ? '-10px' : transformOffset;
      const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
      const finalTransform = `translateY(${modalTransform}) scale(${toPresentingScale})`;

      let finalBorderRadius = '0px';
      const isIPhone = /iPhone/.test(navigator.userAgent);
      const safeArea = getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-bottom');

      // Check if it's an iPhone with an edge-to-edge display
      if (isIPhone === true && safeArea !== '0px') {
        finalBorderRadius = '39px 39px 0 0';
      }

      presentingAnimation
        .addElement(presentingEl)
        .keyframes([
          { offset: 0, filter: 'contrast(0.85)', transform: finalTransform, borderRadius: '10px 10px 0 0' },
          { offset: 1, filter: 'contrast(1)', transform: 'translateY(0px) scale(1)', borderRadius: finalBorderRadius }
        ]);

      baseAnimation.addAnimation(presentingAnimation);
    } else {
      baseAnimation.addAnimation(backdropAnimation);

      if (!hasCardModal) {
        wrapperAnimation.fromTo('opacity', '1', '0');
      } else {
        const toPresentingScale = (hasCardModal) ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
        const finalTransform = `translateY(-10px) scale(${toPresentingScale})`;

        presentingAnimation
          .addElement(presentingEl.querySelector('.modal-wrapper')!)
          .afterStyles({
            'transform': 'translate3d(0, 0, 0)'
          })
          .keyframes([
            { offset: 0, filter: 'contrast(0.85)', transform: finalTransform },
            { offset: 1, filter: 'contrast(1)', transform: 'translateY(0) scale(1)' }
          ]);

        const shadowAnimation = createAnimation()
          .addElement(presentingEl.querySelector('.modal-shadow')!)
          .afterStyles({
            'transform': 'translateY(0) scale(1)'
          })
          .keyframes([
            { offset: 0, opacity: '0', transform: finalTransform },
            { offset: 1, opacity: '1', transform: 'translateY(0) scale(1)' }
          ]);

        baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
      }
    }
  } else {
    baseAnimation.addAnimation(backdropAnimation);
  }

  return baseAnimation;
};
