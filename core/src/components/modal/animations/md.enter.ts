import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import type { ModalAnimationOptions } from '../modal-interface';

import { createSheetEnterAnimation } from './sheet';

const createEnterAnimation = () => {
  const backdropAnimation = createAnimation()
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)')
    .beforeStyles({
      'pointer-events': 'none',
    })
    .afterClearStyles(['pointer-events']);

  const wrapperAnimation = createAnimation().keyframes([
    { offset: 0, opacity: 0.01, transform: 'translateY(40px)' },
    { offset: 1, opacity: 1, transform: `translateY(0px)` },
  ]);

  return { backdropAnimation, wrapperAnimation, contentAnimation: undefined };
};

/**
 * Md Modal Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions): Animation => {
  const { currentBreakpoint, expandToScroll } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation, contentAnimation } =
    currentBreakpoint !== undefined ? createSheetEnterAnimation(opts) : createEnterAnimation();

  backdropAnimation.addElement(root.querySelector('ion-backdrop')!);

  wrapperAnimation.addElement(root.querySelector('.modal-wrapper')!);

  // The content animation is only added if scrolling is enabled for
  // all the breakpoints.
  expandToScroll && contentAnimation?.addElement(baseEl.querySelector('.ion-page')!);

  const baseAnimation = createAnimation()
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(280)
    .addAnimation([backdropAnimation, wrapperAnimation])
    .beforeAddWrite(() => {
      if (expandToScroll) {
        // Scroll can only be done when the modal is fully expanded.
        return;
      }

      /**
       * There are some browsers that causes flickering when
       * dragging the content when scroll is enabled at every
       * breakpoint. This is due to the wrapper element being
       * transformed off the screen and having a snap animation.
       *
       * A workaround is to clone the footer element and append
       * it outside of the wrapper element. This way, the footer
       * is still visible and the drag can be done without
       * flickering. The original footer is hidden until the modal
       * is dismissed. This maintains the animation of the footer
       * when the modal is dismissed.
       *
       * The workaround needs to be done before the animation starts
       * so there are no flickering issues.
       */
      const ionFooter = baseEl.querySelector('ion-footer');
      /**
       * This check is needed to prevent more than one footer
       * from being appended to the shadow root.
       * Otherwise, iOS and MD enter animations would append
       * the footer twice.
       */
      const ionFooterAlreadyAppended = baseEl.shadowRoot!.querySelector('ion-footer');
      if (ionFooter && !ionFooterAlreadyAppended) {
        const footerHeight = ionFooter.clientHeight;
        const clonedFooter = ionFooter.cloneNode(true) as HTMLIonFooterElement;

        baseEl.shadowRoot!.appendChild(clonedFooter);
        ionFooter.style.setProperty('display', 'none');
        ionFooter.setAttribute('aria-hidden', 'true');

        // Padding is added to prevent some content from being hidden.
        const page = baseEl.querySelector('.ion-page') as HTMLElement;
        page.style.setProperty('padding-bottom', `${footerHeight}px`);
      }
    });

  if (contentAnimation) {
    baseAnimation.addAnimation(contentAnimation);
  }

  return baseAnimation;
};
