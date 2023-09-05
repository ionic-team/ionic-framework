import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';
import type { ModalAnimationOptions } from '../modal-interface';

import { createSheetLeaveAnimation } from './sheet';

const createLeaveAnimation = ({ easing }: ModalAnimationOptions) => {
  const backdropAnimation = createAnimation().keyframes([
    { offset: 0, opacity: 'var(--backdrop-opacity)', easing },
    { offset: 1, opacity: 0 },
  ]);
  const wrapperAnimation = createAnimation().keyframes([
    { offset: 0, transform: 'translateY(0vh)', easing },
    { offset: 1, transform: 'translateY(100vh)' },
  ]);

  return { backdropAnimation, wrapperAnimation };
};

/**
 * iOS Modal Leave Animation
 */
export const iosLeaveAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions, duration = 500): Animation => {
  const EASING = 'cubic-bezier(0.32,0.72,0,1)';
  const { presentingEl, currentBreakpoint } = opts;
  const optsWithEasing = { ...opts, easing: EASING };
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation } =
    currentBreakpoint !== undefined ? createSheetLeaveAnimation(optsWithEasing) : createLeaveAnimation(optsWithEasing);

  backdropAnimation.addElement(root.querySelector('ion-backdrop')!);

  wrapperAnimation.addElement(root.querySelectorAll('.modal-wrapper, .modal-shadow')!).beforeStyles({ opacity: 1 });

  const baseAnimation = createAnimation('leaving-base')
    .addElement(baseEl)
    .duration(duration)
    .addAnimation(wrapperAnimation);

  if (presentingEl) {
    const isMobile = window.innerWidth < 768;
    const hasCardModal =
      presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined;
    const presentingElRoot = getElementRoot(presentingEl);

    const presentingAnimation = createAnimation()
      .beforeClearStyles(['transform'])
      .afterClearStyles(['transform'])
      .onFinish((currentStep) => {
        // only reset background color if this is the last card-style modal
        if (currentStep !== 1) {
          return;
        }

        presentingEl.style.setProperty('overflow', '');

        const numModals = (
          Array.from(bodyEl.querySelectorAll('ion-modal:not(.overlay-hidden)')) as HTMLIonModalElement[]
        ).filter((m) => m.presentingElement !== undefined).length;
        if (numModals <= 1) {
          bodyEl.style.setProperty('background-color', '');
        }
      });

    const bodyEl = document.body;

    if (isMobile) {
      const transformOffset = !CSS.supports('width', 'max(0px, 1px)') ? '30px' : 'max(30px, var(--ion-safe-area-top))';
      const modalTransform = hasCardModal ? '-10px' : transformOffset;
      const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
      const finalTransform = `translateY(${modalTransform}) scale(${toPresentingScale})`;

      presentingAnimation.addElement(presentingEl).keyframes([
        {
          offset: 0,
          filter: 'contrast(0.85)',
          transform: finalTransform,
          borderRadius: '10px 10px 0 0',
          easing: EASING,
        },
        { offset: 1, filter: 'contrast(1)', transform: 'translateY(0px) scale(1)', borderRadius: '0px' },
      ]);

      baseAnimation.addAnimation(presentingAnimation);
    } else {
      baseAnimation.addAnimation(backdropAnimation);

      if (!hasCardModal) {
        wrapperAnimation.keyframes([
          { offset: 0, opacity: 1, easing: EASING },
          { offset: 1, opacity: 0 },
        ]);
      } else {
        const toPresentingScale = hasCardModal ? SwipeToCloseDefaults.MIN_PRESENTING_SCALE : 1;
        const finalTransform = `translateY(-10px) scale(${toPresentingScale})`;

        presentingAnimation
          .addElement(presentingElRoot.querySelector('.modal-wrapper')!)
          .afterStyles({
            transform: 'translate3d(0, 0, 0)',
          })
          .keyframes([
            { offset: 0, filter: 'contrast(0.85)', transform: finalTransform, easing: EASING },
            { offset: 1, filter: 'contrast(1)', transform: 'translateY(0) scale(1)' },
          ]);

        const shadowAnimation = createAnimation()
          .addElement(presentingElRoot.querySelector('.modal-shadow')!)
          .afterStyles({
            transform: 'translateY(0) scale(1)',
          })
          .keyframes([
            { offset: 0, opacity: '0', transform: finalTransform, easing: EASING },
            { offset: 1, opacity: '1', transform: 'translateY(0) scale(1)' },
          ]);

        baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
      }
    }
  } else {
    baseAnimation.addAnimation(backdropAnimation);
  }

  return baseAnimation;
};
