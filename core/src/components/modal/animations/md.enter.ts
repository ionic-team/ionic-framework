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

  return { backdropAnimation, wrapperAnimation, contentAnimation: undefined, footerAnimation: undefined };
};

/**
 * Md Modal Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement, opts: ModalAnimationOptions): Animation => {
  const { currentBreakpoint, animateContentHeight } = opts;
  const root = getElementRoot(baseEl);
  const { wrapperAnimation, backdropAnimation, contentAnimation, footerAnimation } =
    currentBreakpoint !== undefined ? createSheetEnterAnimation(baseEl, opts) : createEnterAnimation();

  backdropAnimation.addElement(root.querySelector('ion-backdrop')!);

  wrapperAnimation.addElement(root.querySelector('.modal-wrapper')!);

  contentAnimation?.addElement(baseEl.querySelector('.ion-page')!);

  const baseAnimation = createAnimation()
  .addElement(baseEl)
  .easing('cubic-bezier(0.36,0.66,0.04,1)')
  .duration(280)
  .addAnimation([backdropAnimation, wrapperAnimation])
  .beforeAddWrite(() => {
    if (!animateContentHeight) return;

    const ionFooter = baseEl.querySelector('ion-footer');
    if (ionFooter && footerAnimation) {
      const footerHeight = ionFooter.clientHeight;
      const clonedFooter = ionFooter.cloneNode(true) as HTMLElement;
      baseEl.shadowRoot!.appendChild(clonedFooter);
      ionFooter.remove();

      // add padding bottom to the .ion-page element to be
      // the same as the cloned footer height
      const page = baseEl.querySelector('.ion-page') as HTMLElement;
      page.style.setProperty('padding-bottom', `${footerHeight}px`);
      footerAnimation.addElement(root.querySelector('ion-footer')!);
      }
  });

  if (animateContentHeight && contentAnimation) {
    baseAnimation.addAnimation(contentAnimation);
  }

  if (animateContentHeight && footerAnimation) {
    baseAnimation.addAnimation(footerAnimation);
  }

  return baseAnimation;
};
