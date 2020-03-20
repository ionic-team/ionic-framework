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
  // The top translate Y for the presenting element
  const backdropAnimation = createAnimation()
    .addElement(baseEl.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none'
    })
    .afterClearStyles(['pointer-events']);

  const wrapperAnimation = createAnimation()
    .addElement(baseEl.querySelector('.modal-wrapper')!)
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', 'translateY(100vh)', 'translateY(0vh)');

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(500)
    .addAnimation([backdropAnimation, wrapperAnimation]);

  if (presentingEl) {
    /**
     * Fallback for browsers that does not support `max()` (ex: Firefox)
     * No need to wrry about statusbar padding since engines like Gecko
     * are not used as the engine for standlone Cordova/Capacitor apps
     */
    const transformOffset = (!CSS.supports('width', 'max(0px, 1px)')) ? '30px' : 'max(30px, var(--ion-safe-area-top))';
    const modalTransform = (presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined) ? '-10px' : transformOffset;
    const bodyEl = document.body;
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const finalTransform = `translateY(${modalTransform}) scale(${toPresentingScale})`;

    const presentingAnimation = createAnimation()
      .beforeStyles({
        'transform': 'translateY(0)',
        'transform-origin': 'top center',
        'overflow': 'hidden'
      })
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
  }

  return baseAnimation;
};
