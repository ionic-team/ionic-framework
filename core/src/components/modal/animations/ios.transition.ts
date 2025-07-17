import { createAnimation } from '@utils/animation/animation';
import { getElementRoot } from '@utils/helpers';

import type { Animation } from '../../../interface';
import { SwipeToCloseDefaults } from '../gestures/swipe-to-close';
import type { ModalAnimationOptions } from '../modal-interface';

/**
 * Transition animation from portrait view to landscape view
 * This handles the case where a card modal is open in portrait view
 * and the user switches to landscape view
 */
export const portraitToLandscapeTransition = (
  baseEl: HTMLElement,
  opts: ModalAnimationOptions,
  duration = 300
): Animation => {
  const { presentingEl } = opts;

  if (!presentingEl) {
    // No transition needed for non-card modals
    return createAnimation('portrait-to-landscape-transition');
  }

  const presentingElIsCardModal =
    presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined;
  const presentingElRoot = getElementRoot(presentingEl);
  const bodyEl = document.body;

  const baseAnimation = createAnimation('portrait-to-landscape-transition')
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(duration);

  const presentingAnimation = createAnimation().beforeStyles({
    transform: 'translateY(0)',
    'transform-origin': 'top center',
    overflow: 'hidden',
  });

  if (!presentingElIsCardModal) {
    // The presenting element is not a card modal, so we do not
    // need to care about layering and modal-specific styles.
    const root = getElementRoot(baseEl);
    const wrapperAnimation = createAnimation()
      .addElement(root.querySelectorAll('.modal-wrapper, .modal-shadow')!)
      .fromTo('opacity', '1', '1'); // Keep wrapper visible in landscape

    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', 'var(--backdrop-opacity)', 'var(--backdrop-opacity)'); // Keep backdrop visible

    // Animate presentingEl from portrait state back to normal
    const transformOffset = !CSS.supports('width', 'max(0px, 1px)') ? '30px' : 'max(30px, var(--ion-safe-area-top))';
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const fromTransform = `translateY(${transformOffset}) scale(${toPresentingScale})`;

    presentingAnimation
      .addElement(presentingEl)
      .afterStyles({
        transform: 'translateY(0px) scale(1)',
        'border-radius': '0px',
      })
      .beforeAddWrite(() => bodyEl.style.setProperty('background-color', ''))
      .fromTo('transform', fromTransform, 'translateY(0px) scale(1)')
      .fromTo('filter', 'contrast(0.85)', 'contrast(1)')
      .fromTo('border-radius', '10px 10px 0 0', '0px');

    baseAnimation.addAnimation([presentingAnimation, wrapperAnimation, backdropAnimation]);
  } else {
    // The presenting element is a card modal, so we do
    // need to care about layering and modal-specific styles.
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const fromTransform = `translateY(-10px) scale(${toPresentingScale})`;
    const toTransform = `translateY(0px) scale(1)`;

    presentingAnimation
      .addElement(presentingEl)
      .afterStyles({
        transform: toTransform,
      })
      .fromTo('transform', fromTransform, toTransform)
      .fromTo('filter', 'contrast(0.85)', 'contrast(1)');

    const shadowAnimation = createAnimation()
      .addElement(presentingElRoot.querySelector('.modal-shadow')!)
      .afterStyles({
        transform: toTransform,
        opacity: '0',
      })
      .fromTo('transform', fromTransform, toTransform);

    baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
  }

  return baseAnimation;
};

/**
 * Transition animation from landscape view to portrait view
 * This handles the case where a card modal is open in landscape view
 * and the user switches to portrait view
 */
export const landscapeToPortraitTransition = (
  baseEl: HTMLElement,
  opts: ModalAnimationOptions,
  duration = 300
): Animation => {
  const { presentingEl } = opts;

  if (!presentingEl) {
    // No transition needed for non-card modals
    return createAnimation('landscape-to-portrait-transition');
  }

  const presentingElIsCardModal =
    presentingEl.tagName === 'ION-MODAL' && (presentingEl as HTMLIonModalElement).presentingElement !== undefined;
  const presentingElRoot = getElementRoot(presentingEl);
  const bodyEl = document.body;

  const baseAnimation = createAnimation('landscape-to-portrait-transition')
    .addElement(baseEl)
    .easing('cubic-bezier(0.32,0.72,0,1)')
    .duration(duration);

  const presentingAnimation = createAnimation().beforeStyles({
    transform: 'translateY(0)',
    'transform-origin': 'top center',
    overflow: 'hidden',
  });

  if (!presentingElIsCardModal) {
    // The presenting element is not a card modal, so we do not
    // need to care about layering and modal-specific styles.
    const root = getElementRoot(baseEl);
    const wrapperAnimation = createAnimation()
      .addElement(root.querySelectorAll('.modal-wrapper, .modal-shadow')!)
      .fromTo('opacity', '1', '1'); // Keep wrapper visible

    const backdropAnimation = createAnimation()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', 'var(--backdrop-opacity)', 'var(--backdrop-opacity)'); // Keep backdrop visible

    // Animate presentingEl from normal state to portrait state
    const transformOffset = !CSS.supports('width', 'max(0px, 1px)') ? '30px' : 'max(30px, var(--ion-safe-area-top))';
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const toTransform = `translateY(${transformOffset}) scale(${toPresentingScale})`;

    presentingAnimation
      .addElement(presentingEl)
      .afterStyles({
        transform: toTransform,
      })
      .beforeAddWrite(() => bodyEl.style.setProperty('background-color', 'black'))
      .keyframes([
        { offset: 0, transform: 'translateY(0px) scale(1)', filter: 'contrast(1)', borderRadius: '0px' },
        { offset: 0.2, transform: 'translateY(0px) scale(1)', filter: 'contrast(1)', borderRadius: '10px 10px 0 0' },
        { offset: 1, transform: toTransform, filter: 'contrast(0.85)', borderRadius: '10px 10px 0 0' },
      ]);

    baseAnimation.addAnimation([presentingAnimation, wrapperAnimation, backdropAnimation]);
  } else {
    // The presenting element is also a card modal, so we need
    // to handle layering and modal-specific styles.
    const toPresentingScale = SwipeToCloseDefaults.MIN_PRESENTING_SCALE;
    const fromTransform = `translateY(-10px) scale(${toPresentingScale})`;
    const toTransform = `translateY(0) scale(1)`;

    presentingAnimation
      .addElement(presentingEl)
      .afterStyles({
        transform: toTransform,
      })
      .fromTo('transform', fromTransform, toTransform);

    const shadowAnimation = createAnimation()
      .addElement(presentingElRoot.querySelector('.modal-shadow')!)
      .afterStyles({
        transform: toTransform,
        opacity: '0',
      })
      .fromTo('transform', fromTransform, toTransform);

    baseAnimation.addAnimation([presentingAnimation, shadowAnimation]);
  }

  return baseAnimation;
};
