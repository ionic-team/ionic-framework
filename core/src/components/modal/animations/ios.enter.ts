import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export const iosEnterAnimation = (
    baseEl: HTMLElement,
    presentingEl?: HTMLElement,
  ): Animation => {
  const wrapperAnimation = createAnimation()
    .addElement(baseEl.querySelector('.modal-wrapper')!)
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', 'translateY(100vh)', 'translateY(0vh)');

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(500)
    .beforeAddClass('show-modal')
    .addAnimation(wrapperAnimation);

  const backdropAnimation = createAnimation()
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none'
    })
    .afterClearStyles(['pointer-events']);

  if (presentingEl) {
    const isMobile = window.innerWidth < 768;
    const hasCardModal = (presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined);

    const presentingAnimation = createAnimation()
      .beforeStyles({
        'transform': 'translateY(0)',
        'transform-origin': 'top center',
        'overflow': 'hidden'
      });

    const bodyEl = document.body;

    if (isMobile) {
      const modalTransform = hasCardModal ? '-10px' : 'max(30px, var(--ion-safe-area-top))';
      const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
      const finalTransform = `translateY(${modalTransform}) scale(${toPresentingScale})`;

      presentingAnimation
        .afterStyles({
          'transform': finalTransform
        })
        .beforeAddWrite(() => bodyEl.style.setProperty('background-color', 'black'))
        .addElement(presentingEl)
        .keyframes([
          { offset: 0, filter: 'contrast(1)', transform: 'translateY(0px) scale(1)', borderRadius: '0px' },
          { offset: 1, filter: 'contrast(0.85)', transform: finalTransform, borderRadius: '10px 10px 0 0' }
        ]);

      baseAnimation.addAnimation(presentingAnimation);
    } else {
      if (!hasCardModal) {
        wrapperAnimation.fromTo('opacity', '0', '1');
        baseAnimation.addAnimation(backdropAnimation);
      } else {
        const toPresentingScale = (hasCardModal) ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
        const finalTransform = `translateY(-10px) scale(${toPresentingScale})`;

        presentingAnimation
          .afterStyles({
            'transform': finalTransform
          })
          .addElement(presentingEl.querySelector('.modal-wrapper')!)
          .keyframes([
            { offset: 0, filter: 'contrast(1)', transform: 'translateY(0) scale(1)' },
            { offset: 1, filter: 'contrast(0.85)', transform: finalTransform }
          ]);

        baseAnimation.addAnimation(presentingAnimation);
      }
    }
  } else {
    baseAnimation.addAnimation(backdropAnimation);
  }

  return baseAnimation;
};
