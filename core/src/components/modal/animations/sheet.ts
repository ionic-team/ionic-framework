import { createAnimation } from '@utils/animation/animation';

import type { ModalAnimationOptions } from '../modal-interface';
import { getBackdropValueForSheet } from '../utils';

/**
 * We apply the easing curve to the 0th keyframe
 * instead of on the effect as a whole to avoid https://bugs.webkit.org/show_bug.cgi?id=241020
 * This bug is most noticeable on animations that slide off the screen.
 */
export const createSheetEnterAnimation = (opts: ModalAnimationOptions) => {
  const { currentBreakpoint, backdropBreakpoint, easing } = opts;

  /**
   * If the backdropBreakpoint is undefined, then the backdrop
   * should always fade in. If the backdropBreakpoint came before the
   * current breakpoint, then the backdrop should be fading in.
   */
  const shouldShowBackdrop = backdropBreakpoint === undefined || backdropBreakpoint < currentBreakpoint!;
  const initialBackdrop = shouldShowBackdrop ? `calc(var(--backdrop-opacity) * ${currentBreakpoint!})` : '0';

  const backdropAnimation = createAnimation('backdropAnimation').keyframes([
    { offset: 0, opacity: 0, easing },
    { offset: 1, opacity: initialBackdrop },
  ]);

  if (shouldShowBackdrop) {
    backdropAnimation
      .beforeStyles({
        'pointer-events': 'none',
      })
      .afterClearStyles(['pointer-events']);
  }

  const wrapperAnimation = createAnimation('wrapperAnimation').keyframes([
    { offset: 0, opacity: 1, transform: 'translateY(100%)', easing },
    { offset: 1, opacity: 1, transform: `translateY(${100 - currentBreakpoint! * 100}%)` },
  ]);

  return { wrapperAnimation, backdropAnimation };
};

export const createSheetLeaveAnimation = (opts: ModalAnimationOptions) => {
  const { currentBreakpoint, backdropBreakpoint, easing } = opts;

  /**
   * Backdrop does not always fade in from 0 to 1 if backdropBreakpoint
   * is defined, so we need to account for that offset by figuring out
   * what the current backdrop value should be.
   */
  const backdropValue = `calc(var(--backdrop-opacity) * ${getBackdropValueForSheet(
    currentBreakpoint!,
    backdropBreakpoint!
  )})`;
  const defaultBackdrop = [
    { offset: 0, opacity: backdropValue, easing },
    { offset: 1, opacity: 0 },
  ];

  /**
   * The above WebKit bug only applies when
   * an animation has 2 keyframes, so when using
   * the below keyframes we can continue to apply
   * the easing curve to the entire effect.
   * Note that since there are more than 2 keyframes
   * here applying the easing curve to the 0th keyframe
   * would product a different result than applying
   * the easing curve to the entire effect as the
   * easing for keyframes 1 to 2 would be linear.
   */
  const customBackdrop = [
    { offset: 0, opacity: backdropValue },
    { offset: backdropBreakpoint!, opacity: 0 },
    { offset: 1, opacity: 0 },
  ];

  const useCustomBackdrop = backdropBreakpoint !== 0;

  const backdropAnimation = createAnimation('backdropAnimation').keyframes(
    useCustomBackdrop ? customBackdrop : defaultBackdrop
  );

  if (useCustomBackdrop) {
    backdropAnimation.easing(easing);
  }

  const wrapperAnimation = createAnimation('wrapperAnimation').keyframes([
    { offset: 0, opacity: 1, transform: `translateY(${100 - currentBreakpoint! * 100}%)`, easing },
    { offset: 1, opacity: 1, transform: `translateY(100%)` },
  ]);

  return { wrapperAnimation, backdropAnimation };
};
