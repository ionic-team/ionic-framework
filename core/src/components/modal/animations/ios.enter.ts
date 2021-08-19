import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { getElementRoot } from '../../../utils/helpers';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';

/**
 * iOS Modal Enter Animation for the Card presentation style
 */
export const iosEnterAnimation = (
  baseEl: HTMLElement,
  opts: any
): Animation => {
  const { presentingEl, destroyOnFinish } = opts;

  const root = getElementRoot(baseEl);
  // If an initial breakpoint was passed we need to transform the modal to be that
  // far from the top, otherwise we will transform it to the top (0vh)
  const initialBreakpoint = (baseEl as HTMLIonModalElement).initialBreakpoint;
  const initialHeight = initialBreakpoint ? `${100 - (initialBreakpoint * 100)}vh` : '0vh';
  const initialOpacity = initialBreakpoint ? `calc(var(--backdrop-opacity) * ${initialBreakpoint})` : 'var(--backdrop-opacity)';

  const backdropAnimation = createAnimation('backdropAnimation')
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, initialOpacity)
    .beforeStyles({
      'pointer-events': 'none'
    })
    .afterClearStyles(['pointer-events']);

  const wrapperAnimation = createAnimation('wrapperAnimation')
    .addElement(root.querySelectorAll('.modal-wrapper, .modal-shadow')!)
    .beforeStyles({ 'opacity': 1 })
    .fromTo('transform', 'translateY(100vh)', `translateY(${initialHeight})`);

  const baseAnimation = createAnimation('entering-base')
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(500)
    .addAnimation(wrapperAnimation);

  if (presentingEl) {
    const isMobile = window.innerWidth < 768;
    const hasCardModal = (presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined);
    const presentingElRoot = getElementRoot(presentingEl);

    const presentingAnimation = createAnimation()
      .beforeStyles({
        'transform': 'translateY(0)',
        'transform-origin': 'top center',
        'overflow': 'hidden'
      });

    const bodyEl = document.body;

    if (isMobile) {
      /**
       * Fallback for browsers that does not support `max()` (ex: Firefox)
       * No need to worry about statusbar padding since engines like Gecko
       * are not used as the engine for standalone Cordova/Capacitor apps
       */
      const transformOffset = (!CSS.supports('width', 'max(0px, 1px)')) ? '30px' : 'max(30px, var(--ion-safe-area-top))';
      const modalTransform = hasCardModal ? '-10px' : transformOffset;
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
      baseAnimation.addAnimation(backdropAnimation);

      if (!hasCardModal) {
        wrapperAnimation.fromTo('opacity', '0', '1');
      } else {
        const toPresentingScale = (hasCardModal) ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
        const finalTransform = `translateY(-10px) scale(${toPresentingScale})`;

        presentingAnimation
          .afterStyles({
            'transform': finalTransform
          })
          .addElement(presentingElRoot.querySelector('.modal-wrapper')!)
          .keyframes([
            { offset: 0, filter: 'contrast(1)', transform: 'translateY(0) scale(1)' },
            { offset: 1, filter: 'contrast(0.85)', transform: finalTransform }
          ]);

        const shadowAnimation = createAnimation()
          .afterStyles({
            'transform': finalTransform
          })
          .addElement(presentingElRoot.querySelector('.modal-shadow')!)
          .keyframes([
            { offset: 0, opacity: '1', transform: 'translateY(0) scale(1)' },
            { offset: 1, opacity: '0', transform: finalTransform }
          ]);

        baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
      }
    }
  } else {
    baseAnimation.addAnimation(backdropAnimation);
  }


  if (destroyOnFinish) {
    baseAnimation.onFinish(() => {
      requestAnimationFrame(() => {
        baseAnimation.destroy();
        console.log('destroying initial animation')
      });
    });
  }
  return baseAnimation;
};
