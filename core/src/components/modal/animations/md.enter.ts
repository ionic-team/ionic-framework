import { Animation } from '../../../interface';
import { createAnimation } from '../../../utils/animation/animation';
import { getElementRoot } from '../../../utils/helpers';

/**
 * Md Modal Enter Animation
 */
export const mdEnterAnimation = (baseEl: HTMLElement): Animation => {
  const root = getElementRoot(baseEl);
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();

  // If an initial breakpoint was passed we need to transform the modal to be that
  // far from the top, otherwise we will transform it to the top (0vh)
  const initialBreakpoint = (baseEl as HTMLIonModalElement).initialBreakpoint;
  const initialHeight = initialBreakpoint ? `${100 - (initialBreakpoint * 100)}vh` : '0vh';
  const initialOpacity = initialBreakpoint ? `calc(var(--backdrop-opacity) * ${initialBreakpoint})` : 'var(--backdrop-opacity)';

  backdropAnimation
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', 0.01, initialOpacity)
    .beforeStyles({
      'pointer-events': 'none'
    })
    .afterClearStyles(['pointer-events']);

  wrapperAnimation
    .addElement(root.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: 0.01, transform: initialBreakpoint ? 'translateY(100vh)' : 'translateY(40px)' },
      { offset: 1, opacity: 1, transform: `translateY(${initialHeight})` }
    ]);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(280)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};
