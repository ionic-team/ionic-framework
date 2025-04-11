import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ModalAnimationOptions } from '../modal-interface';

import { createSheetLeaveAnimation } from './sheet';

const createLeaveAnimation = () => {
  const backdropAnimation = createAnimation().fromTo('opacity', 'var(--backdrop-opacity)', 0);

  const wrapperAnimation = createAnimation().keyframes([
    { offset: 0, opacity: 0.99, transform: `translateY(0px)` },
    { offset: 1, opacity: 0, transform: 'translateY(40px)' },
  ]);

  return { backdropAnimation, wrapperAnimation };
};

/**
 * Md Modal Leave Animation
 */
export const mdLeaveAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions): Animation => {
  const { currentBreakpoint, expandToScroll } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation } =
    currentBreakpoint !== undefined ? createSheetLeaveAnimation(opts) : createLeaveAnimation();

  backdropAnimation.addElement(root.querySelector('ion-backdrop')!);
  wrapperAnimation.addElement(root.querySelector('.modal-wrapper')!);

  const baseAnimation = createAnimation()
    .easing('cubic-bezier(0.47,0,0.745,0.715)')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation])
    .beforeAddWrite(() => {
      if (expandToScroll) {
        // Scroll can only be done when the modal is fully expanded.
        return;
      }

      /**
       * If expandToScroll is disabled, we need to swap
       * the visibility to the original, so the footer
       * dismisses with the modal and doesn't stay
       * until the modal is removed from the DOM.
       */
      const ionFooter = baseEl.querySelector('ion-footer');
      if (ionFooter) {
        const clonedFooter = baseEl.shadowRoot!.querySelector('ion-footer')!;

        ionFooter.style.removeProperty('display');
        ionFooter.removeAttribute('aria-hidden');

        clonedFooter.style.setProperty('display', 'none');
        clonedFooter.setAttribute('aria-hidden', 'true');

        const page = baseEl.querySelector('.ion-page') as HTMLElement;
        page.style.removeProperty('padding-bottom');
      }
    });

  return baseAnimation;
};
